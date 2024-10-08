//! # Volga
//!
//! > Fast & Easy Web Framework for Rust based on [Tokio](https://tokio.rs/) runtime for fun and painless microservices crafting.
//!
//! ```toml
//! [dependencies]
//! volga = "0.1.8"
//! tokio = "1.40.0"
//! ```
//! ```no_run
//! use volga::{App, Results, AsyncEndpointsMapping};
//!
//! #[tokio::main]
//! async fn main() -> tokio::io::Result<()> {
//!     // Start the server
//!     let mut server = App::build("localhost:7878").await?;
//!
//!     // Example of asynchronous GET request handler
//!     server.map_get("/hello", |request| async {
//!         Results::text("Hello World!")
//!     }).await;
//!     
//!     server.run().await
//! }
//! ```

pub mod app;

pub use crate::app::{App, HttpContext};
pub use crate::app::endpoints::mapping::asynchronous::AsyncEndpointsMapping;
pub use crate::app::endpoints::mapping::synchronous::SyncEndpointsMapping;
pub use crate::app::middlewares::Next;
pub use crate::app::middlewares::mapping::asynchronous::AsyncMiddlewareMapping;
pub use crate::app::results::{HttpResponse, HttpResult, Results, ResponseContext};
pub use crate::app::request::{HttpRequest, RequestParams, payload::Payload, params::Params};