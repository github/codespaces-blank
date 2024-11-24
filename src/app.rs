use std::sync::Arc;
use hyper_util::rt::TokioIo;

use tokio::{
    net::{TcpListener, TcpStream},
    io::{self, Error},
    sync::broadcast, 
    signal
};
use tokio::io::ErrorKind::{
    InvalidData
};
use crate::app::{
    pipeline::{Pipeline, PipelineBuilder},
    endpoints::Endpoints,
    scope::Scope,
    server::Server
};

#[cfg(feature = "middleware")]
use crate::app::middlewares::{
    Middlewares, 
    mapping::asynchronous::AsyncMiddlewareMapping
};

#[cfg(feature = "middleware")]
pub mod middlewares;
#[cfg(feature = "middleware")]
pub mod http_context;
pub mod endpoints;
pub mod body;
pub mod request;
pub mod results;
pub mod mapping;
pub(crate) mod pipeline;
mod scope;
mod server;

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
    pipeline: PipelineBuilder,
    connection: Connection
}

struct Connection {
    tcp_listener: TcpListener,
    shutdown_signal: broadcast::Receiver<()>,
    shutdown_sender: broadcast::Sender<()>
}

impl App {
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
            return Err(Error::new(InvalidData, "An empty socket has been provided."));
        }

        let tcp_listener = TcpListener::bind(socket).await?;
        let (shutdown_sender, shutdown_receiver) = broadcast::channel::<()>(1);

        Self::subscribe_for_ctrl_c_signal(&shutdown_sender);
        
        let connection = Connection { 
            tcp_listener, 
            shutdown_sender, 
            shutdown_signal: shutdown_receiver
        };
        
        let server = Self {
            connection,
            pipeline:PipelineBuilder::new()
        };

        println!("Start listening: {socket}");
        
        Ok(server)
    }

    /// Runs the Web Server
    pub async fn run(mut self) -> io::Result<()> {
        #[cfg(feature = "middleware")]
        {
            // Register default middleware
            self.use_endpoints();
        }

        let connection = &mut self.connection;
        let pipeline = Arc::new(self.pipeline.build());
        
        loop {
            tokio::select! {
                Ok((stream, _)) = connection.tcp_listener.accept() => {
                    let pipeline = pipeline.clone();
                    let io = TokioIo::new(stream);
                    
                    tokio::spawn(Self::handle_connection(io, pipeline));
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

    #[cfg(feature = "middleware")]
    pub(crate) fn middlewares_mut(&mut self) -> &mut Middlewares {
        self.pipeline.middlewares_mut()
    }

    pub(crate) fn endpoints_mut(&mut self) -> &mut Endpoints {
        self.pipeline.endpoints_mut()
    }

    #[inline]
    fn subscribe_for_ctrl_c_signal(shutdown_sender: &broadcast::Sender<()>) {
        let ctrl_c_shutdown_sender = shutdown_sender.clone();
        tokio::spawn(async move {
            match signal::ctrl_c().await {
                Ok(_) => (),
                Err(err) => eprintln!("Unable to listen for shutdown signal: {}", err)
            };

            match ctrl_c_shutdown_sender.send(()) {
                Ok(_) => (),
                Err(err) => eprintln!("Failed to send shutdown signal: {}", err)
            }
        });
    }

    #[cfg(feature = "middleware")]
    fn use_endpoints(&mut self) {
        if self.pipeline.has_middleware_pipeline() {
            self.use_middleware(|ctx, _| async move {
                ctx.execute().await
            });
        }
    }
    
    async fn handle_connection(io: TokioIo<TcpStream>, pipeline: Arc<Pipeline>) {
        let server = Server::new(io);
        let scope = Scope::new(pipeline);
        
        server.serve(scope).await;
    }
}