use std::net::SocketAddr;
use std::sync::Arc;

use hyper_util::rt::TokioIo;

use tokio::{
    net::{TcpListener, TcpStream},
    io::self,
    sync::broadcast, 
    signal
};

use crate::app::{
    pipeline::{Pipeline, PipelineBuilder},
    endpoints::Endpoints,
    scope::Scope,
    server::Server
};

#[cfg(feature = "middleware")]
use crate::app::middlewares::{Middlewares, Middleware};

#[cfg(feature = "middleware")]
pub mod middlewares;
#[cfg(feature = "middleware")]
pub mod http_context;
pub mod endpoints;
pub mod body;
pub mod request;
pub mod results;
pub mod router;
pub(crate) mod pipeline;
mod scope;
mod server;

const DEFAULT_PORT: u16 = 7878;

/// The web application used to configure the HTTP pipeline, and routes.
///
/// # Examples
/// ```no_run
///use volga::App;
///
///#[tokio::main]
///async fn main() -> std::io::Result<()> {
///    let mut app = App::new().bind("127.0.0.1:8080");
///    
///    app.run().await
///}
/// ```
pub struct App {
    pipeline: PipelineBuilder,
    connection: Connection
}

struct Connection {
    socket: SocketAddr
}

impl Default for Connection {
    fn default() -> Self {
        let socket = SocketAddr::from(([127, 0, 0, 1], DEFAULT_PORT));
        Self { socket }
    }
}

impl Connection {
    fn new(socket: &str) -> Self {
        if let Ok(socket) = socket.parse::<SocketAddr>() {
            Self { socket }    
        } else { 
            Self::default()
        }
    }
}

impl Default for App {
    fn default() -> Self {
        Self::new()
    }
}

impl App {
    /// Initializes a new instance of the `App` which will be bound to the 127.0.0.1:7878 socket by default.
    /// 
    ///# Examples
    /// ```no_run
    /// use volga::App;
    ///
    /// let app = App::new();
    /// ```
    pub fn new() -> Self {
        Self {
            pipeline:PipelineBuilder::new(),
            connection: Default::default()
        }
    }

    /// Binds the `App` to the specified `socket` address.
    /// 
    ///# Examples
    /// ```no_run
    ///use volga::App;
    ///
    ///let app = App::new().bind("127.0.0.1:7878");
    /// ```
    pub fn bind(mut self, socket: &str) -> Self {
        self.connection = Connection::new(socket);
        self
    }

    /// Runs the `App`
    pub async fn run(mut self) -> io::Result<()> {
        #[cfg(feature = "middleware")]
        {
            // Register default middleware
            self.use_endpoints();
        }

        let socket = self.connection.socket;
        let tcp_listener = TcpListener::bind(socket).await?;
        println!("Start listening: {socket}");
        
        let (shutdown_sender, mut shutdown_signal) = broadcast::channel::<()>(1);
        
        Self::subscribe_for_ctrl_c_signal(&shutdown_sender);
        
        let pipeline = Arc::new(self.pipeline.build());
        loop {
            tokio::select! {
                Ok((stream, _)) = tcp_listener.accept() => {
                    let pipeline = pipeline.clone();
                    let io = TokioIo::new(stream);
                    
                    tokio::spawn(Self::handle_connection(io, pipeline));
                }
                _ = shutdown_signal.recv() => {
                    println!("Shutting down server...");
                    break;
                }
            }
        }
        Ok(())
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

#[cfg(test)]
mod tests {
    use std::net::SocketAddr;
    use crate::App;
    use crate::app::Connection;

    #[test]
    fn it_creates_connection_with_default_socket() {
        let connection = Connection::default();

        assert_eq!(connection.socket, SocketAddr::from(([127, 0, 0, 1], 7878)));
    }

    #[test]
    fn it_creates_connection_with_specified_socket() {
        let connection = Connection::new("127.0.0.1:5000");

        assert_eq!(connection.socket, SocketAddr::from(([127, 0, 0, 1], 5000)));
    }
    
    #[test]
    fn it_creates_app_with_default_socket() {
        let app = App::new();
        
        assert_eq!(app.connection.socket, SocketAddr::from(([127, 0, 0, 1], 7878)));
    }

    #[test]
    fn it_binds_app_to_socket() {
        let app = App::new().bind("127.0.0.1:5001");

        assert_eq!(app.connection.socket, SocketAddr::from(([127, 0, 0, 1], 5001)));
    }
}