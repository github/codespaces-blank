//! # Volga
//!
//! > Fast & Easy Web Framework for Rust based on [Tokio](https://tokio.rs/) runtime for fun and painless microservices crafting.
//!
//! ```toml
//! [dependencies]
//! volga = "0.2.4"
//! tokio = "1.41.0"
//! ```
//! ```no_run
//! use volga::{App, ok, AsyncEndpointsMapping};
//!
//! #[tokio::main]
//! async fn main() -> std::io::Result<()> {
//!     // Start the server
//!     let mut app = App::build("localhost:7878").await?;
//!
//!     // Example of asynchronous GET request handler
//!     app.map_get("/hello", |request| async {
//!         ok!("Hello World!")
//!     });
//!     
//!     app.run().await
//! }
//! ```

pub mod app;

pub use crate::app::{App, HttpContext};
pub use crate::app::endpoints::mapping::{asynchronous::AsyncEndpointsMapping, synchronous::SyncEndpointsMapping};
pub use crate::app::middlewares::{Next, mapping::asynchronous::AsyncMiddlewareMapping};
pub use crate::app::results::{HttpResponse, HttpResult, Results, ResponseContext};
pub use crate::app::request::{HttpRequest, RequestParams, payload::Payload, params::Params, cancel::Cancel};

// Exposing shortcut for CancellationToken for convenience
pub use tokio_util::sync::CancellationToken;