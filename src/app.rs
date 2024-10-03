use bytes::Bytes;
use httparse::EMPTY_HEADER;
use http::{Request, Response};
use std::{io, sync::Arc};

use tokio::{
    net::{TcpListener, TcpStream},
    io::{AsyncReadExt, AsyncWriteExt},
    sync::{broadcast, Mutex},
    signal
};

use crate::app::{
    endpoints::{Endpoints, EndpointContext},
    middlewares::{Middlewares, mapping::asynchronous::AsyncMiddlewareMapping},
    request::RawRequest,
    results::Results
};

pub mod middlewares;
pub mod endpoints;
pub mod request;
pub mod results;
pub mod mapping;

pub struct App {
    middlewares: Arc<Mutex<Middlewares>>,
    endpoints: Arc<Mutex<Endpoints>>,
    tcp_listener: TcpListener,
    shutdown_signal: broadcast::Receiver<()>,
    shutdown_sender: broadcast::Sender<()>
}

pub struct HttpContext {
    pub request: Arc<Request<Bytes>>,
    endpoint_context: EndpointContext
}

impl HttpContext {
    async fn execute(&self) -> http::Result<Response<Bytes>> {
        let request = &self.request;
        self.endpoint_context.handler.call(request.clone()).await
    }
}

impl App {
    pub async fn build(socket: &str) -> Result<App, Box<dyn std::error::Error + Send + Sync>> {
        if socket.is_empty() {
            return Err("An empty socket has been provided.".into());
        }

        let tcp_listener = TcpListener::bind(socket).await?;
        let (shutdown_sender, shutdown_receiver) = broadcast::channel::<()>(1);

        let ctrl_c_shutdown_sender = shutdown_sender.clone();
        tokio::spawn(async move {
            match signal::ctrl_c().await {
                Ok(_) => (),
                Err(err) => {
                    eprintln!("Unable to listen for shutdown signal: {}", err);
                }
            };

            match ctrl_c_shutdown_sender.send(()) {
                Ok(_) => (),
                Err(err) => {
                    eprintln!("Failed to send shutdown signal: {}", err);
                }
            }
        });

        let server = Self {
            tcp_listener,
            shutdown_sender,
            shutdown_signal: shutdown_receiver,
            middlewares: Arc::new(Mutex::new(Middlewares::new())),
            endpoints: Arc::new(Mutex::new(Endpoints::new()))
        };

        println!("Start listening: {socket}");
        Ok(server)
    }

    pub async fn run(&mut self) -> io::Result<()> {
        self.use_middleware(|ctx, _| async move {
            ctx.execute().await
        }).await;

        loop {
            tokio::select! {
                Ok((socket, _)) = self.tcp_listener.accept() => {
                    let middlewares = Arc::clone(&self.middlewares);
                    let endpoints = Arc::clone(&self.endpoints);
                    
                    tokio::spawn(async move {
                        Self::handle_connection(&middlewares, &endpoints, socket).await;
                    });
                }
                _ = self.shutdown_signal.recv() => {
                    println!("Shutting down server...");
                    break;
                }
            }
        }

        Ok(())
    }

    pub fn shutdown(&self) {
        match self.shutdown_sender.send(()) {
            Ok(_) => (),
            Err(err) => {
                eprintln!("Failed to send shutdown the server: {}", err);
            }
        }
    }

    #[inline]
    async fn handle_connection(middlewares: &Arc<Mutex<Middlewares>>, endpoints: &Arc<Mutex<Endpoints>>, mut socket: TcpStream) {
        let mut buffer = [0; 1024];
        loop {
            match Self::handle_request(middlewares, endpoints, &mut socket, &mut buffer).await {
                Ok(response) => {
                    if let Err(err) = Self::write_response(&mut socket, &response).await {
                        eprintln!("Failed to write to socket: {:?}", err);
                        break; // Break the loop if fail to write to the socket
                    }
                }
                Err(err) => {
                    eprintln!("Error occurred handling request: {}", err);
                    break;  // Break the loop if handle_request returns an error
                }
            }
        }

        println!("Connection handling has ended.");
    }

    #[inline]
    async fn handle_request(middlewares: &Arc<Mutex<Middlewares>>, endpoints: &Arc<Mutex<Endpoints>>, socket: &mut TcpStream, buffer: &mut [u8]) -> Result<Response<Bytes>, io::Error> {
        let bytes_read = socket.read(buffer).await?;
        if bytes_read == 0 {
            return Err(io::Error::new(io::ErrorKind::BrokenPipe, "Client closed the connection"));
        }

        let mut headers = [EMPTY_HEADER; 16]; // Adjust header size as necessary
        let parse_req = RawRequest::parse_request(&buffer[..bytes_read], &mut headers)?;
        let mut http_request = RawRequest::convert_to_http_request(parse_req)?;

        let endpoints_guard = endpoints.lock().await;
        if let Some(endpoint_context) = endpoints_guard.get_endpoint(&http_request).await {
            let extensions = http_request.extensions_mut();
            extensions.insert(endpoint_context.params.clone());

            let context = HttpContext {
                request: Arc::new(http_request),
                endpoint_context
            };

            let middlewares_guard = middlewares.lock().await;
            let response = middlewares_guard.execute(Arc::new(context)).await;

            Ok(response.unwrap())
        } else {
            Ok(Results::not_found().unwrap())
        }
    }

    #[inline]
    async fn write_response(stream: &mut TcpStream, response: &Response<Bytes>) -> io::Result<()> {
        let mut response_bytes = vec![];

        // Start with the HTTP status line
        let status_line = format!(
            "HTTP/1.1 {} {}\r\n",
            response.status().as_u16(),
            response.status().canonical_reason().unwrap_or("unknown status")
        );
        response_bytes.extend_from_slice(status_line.as_bytes());

        // Write headers
        for (key, value) in response.headers() {
            let header_value = match value.to_str() {
                Ok(v) => v,
                Err(_) => return Err(io::Error::new(io::ErrorKind::InvalidData, "Invalid header value")),
            };
            let header = format!("{}: {}\r\n", key, header_value);
            response_bytes.extend_from_slice(header.as_bytes());
        }

        // End of headers section
        response_bytes.extend_from_slice(b"\r\n");

        // Write body
        if !response.body().is_empty() {
            response_bytes.extend_from_slice(response.body());
        }

        stream.write_all(&response_bytes).await?;
        stream.flush().await
    }
}