use std::future::Future;
use httparse::EMPTY_HEADER;
use std::sync::Arc;

use tokio::{
    net::{TcpListener, TcpStream},
    io::{self, AsyncReadExt, AsyncWriteExt},
    sync::{broadcast, Mutex},
    signal
};
use tokio_util::sync::CancellationToken;

use crate::app::{
    endpoints::{Endpoints, EndpointContext},
    middlewares::{Middlewares, mapping::asynchronous::AsyncMiddlewareMapping},
    request::{RawRequest, HttpRequest},
    results::{Results, HttpResponse, HttpResult}
};

pub mod middlewares;
pub mod endpoints;
pub mod request;
pub mod results;
pub mod mapping;

/// The web application used to configure the HTTP pipeline, and routes.
///
/// # Examples
/// ```no_run
///use volga::App;
///
///#[tokio::main]
///async fn main() -> std::io::Result<()> {
///    let mut app = App::build("127.0.0.1:7878").await?;
///    
///    app.run().await
///}
/// ```
pub struct App {
    pipeline: Arc<Pipeline>,
    connection: Connection
}

struct Pipeline {
    middlewares: Mutex<Middlewares>,
    endpoints: Mutex<Endpoints>
}

struct Connection {
    tcp_listener: TcpListener,
    shutdown_signal: broadcast::Receiver<()>,
    shutdown_sender: broadcast::Sender<()>
}

pub struct HttpContext {
    pub request: Arc<HttpRequest>,
    endpoint_context: EndpointContext
}

pub(crate) type BoxedHttpResultFuture = Box<dyn Future<Output = HttpResult> + Send>;

impl HttpContext {
    #[inline]
    async fn execute(&self) -> HttpResult {
        let request = &self.request;
        self.endpoint_context.handler.call(request.clone()).await
    }
}

impl App {
    #[inline]
    pub(crate) fn middlewares(&self) -> &Mutex<Middlewares> {
        &self.pipeline.middlewares
    }

    #[inline]
    pub(crate) fn endpoints(&self) -> &Mutex<Endpoints> {
        &self.pipeline.endpoints
    }
    
    /// Initializes a new instance of the `App` on specified `socket`.
    /// 
    ///# Examples
    /// ```no_run
    ///use volga::App;
    ///
    ///#[tokio::main]
    ///async fn main() -> std::io::Result<()> {
    ///    let mut app = App::build("127.0.0.1:7878").await?;
    ///    
    ///    app.run().await
    ///}
    /// ```
    pub async fn build(socket: &str) -> io::Result<App> {
        if socket.is_empty() {
            return Err(io::Error::new(io::ErrorKind::InvalidData, "An empty socket has been provided."));
        }

        let tcp_listener = TcpListener::bind(socket).await?;
        let (shutdown_sender, shutdown_receiver) = broadcast::channel::<()>(1);

        Self::subscribe_for_ctrl_c_signal(&shutdown_sender);

        let pipeline = Pipeline {
            middlewares: Mutex::new(Middlewares::new()),
            endpoints: Mutex::new(Endpoints::new())
        };
        
        let server = Self {
            connection: Connection { tcp_listener, shutdown_sender, shutdown_signal: shutdown_receiver },
            pipeline: Arc::new(pipeline)
        };

        println!("Start listening: {socket}");
        
        Ok(server)
    }

    /// Runs the Web Server
    pub async fn run(&mut self) -> io::Result<()> {
        self.use_endpoints().await;

        let connection = &mut self.connection;
        let pipeline = &self.pipeline;
        
        loop {
            tokio::select! {
                Ok((socket, _)) = connection.tcp_listener.accept() => {
                    let pipeline = pipeline.clone();
                    
                    tokio::spawn(async move {
                        Self::handle_connection(&pipeline, socket).await;
                    });
                }
                _ = connection.shutdown_signal.recv() => {
                    println!("Shutting down server...");
                    break;
                }
            }
        }

        Ok(())
    }

    /// Gracefully shutdown the server
    pub fn shutdown(&self) {
        match self.connection.shutdown_sender.send(()) {
            Ok(_) => (),
            Err(err) => {
                eprintln!("Failed to send shutdown the server: {}", err);
            }
        };
    }

    #[inline]
    fn subscribe_for_ctrl_c_signal(shutdown_sender: &broadcast::Sender<()>) {
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
    }
    
    #[inline]
    async fn use_endpoints(&mut self) {
        self.use_middleware(|ctx, _| async move {
            ctx.execute().await
        }).await;
    }

    #[inline]
    async fn handle_connection(pipeline: &Arc<Pipeline>, mut socket: TcpStream) {
        let cancellation_token = CancellationToken::new();
        let mut buffer = [0; 1024];
        
        loop {
            tokio::select! {
                response = Self::handle_request(pipeline, &mut socket, &mut buffer, cancellation_token.clone()) => {
                    match response {
                        Ok(response) => {
                            if let Err(err) = Self::write_response(&mut socket, &response).await {
                                if cfg!(debug_assertions) {
                                    eprintln!("Failed to write to socket: {:?}", err);
                                }
                                cancellation_token.cancel();
                                break; // Break the loop if fail to write to the socket
                            }
                        }
                        Err(err) => {
                            if cfg!(debug_assertions) {
                                eprintln!("Error occurred handling request: {}", err);  
                            }
                            cancellation_token.cancel();
                            break; // Break the loop if handle_request returns an error
                        }
                    }
                }

                _ = cancellation_token.cancelled() => {
                    if cfg!(debug_assertions) {
                        println!("Task was cancelled.");
                    }
                    break;
                }
            }
        }
    }

    async fn handle_request(pipeline: &Arc<Pipeline>, socket: &mut TcpStream, buffer: &mut [u8], cancellation_token: CancellationToken) -> io::Result<HttpResponse> {
        let bytes_read = socket.read(buffer).await?;
        if bytes_read == 0 {
            return Err(io::Error::new(io::ErrorKind::BrokenPipe, "Client closed the connection"));
        }

        let mut http_request = Self::parse_http_request(&mut buffer[..bytes_read])?;

        let endpoints_guard = pipeline.endpoints.lock().await;
        if let Some(endpoint_context) = endpoints_guard.get_endpoint(&http_request).await {
            let extensions = http_request.extensions_mut();
            extensions.insert(cancellation_token.clone());

            if !endpoint_context.params.is_empty() {
                extensions.insert(endpoint_context.params.clone());   
            }

            let context = HttpContext {
                request: Arc::new(http_request),
                endpoint_context
            };

            let middlewares_guard = pipeline.middlewares.lock().await;
            match middlewares_guard.execute(Arc::new(context)).await {
                Ok(response) => Ok(response),
                Err(error) if error.kind() == io::ErrorKind::InvalidInput => Results::bad_request(error.to_string()),
                _ => Results::internal_server_error()
            }
        } else {
            Results::not_found()
        }
    }
    
    #[inline]
    fn parse_http_request(buffer: &mut [u8]) -> io::Result<HttpRequest> {
        let mut headers = [EMPTY_HEADER; 16]; // Adjust header size as necessary
        let parse_req = RawRequest::parse_request(buffer, &mut headers)?;
        
        RawRequest::convert_to_http_request(parse_req)
    }

    async fn write_response(stream: &mut TcpStream, response: &HttpResponse) -> io::Result<()> {
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

impl Drop for App {
    fn drop(&mut self) {
        self.shutdown();
    }
}