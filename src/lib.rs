//! # Volga
//!
//! > Fast, Easy, and very flexible Web Framework for Rust based on [Tokio](https://tokio.rs/) runtime and [hyper](https://hyper.rs/) for fun and painless microservices crafting.
//!
//! ```toml
//! [dependencies]
//! volga = "0.3.0"
//! tokio = "1.41.1"
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

#[cfg(test)]
pub mod test_utils;

pub use crate::app::{App, http_context::HttpContext};
pub use crate::app::endpoints::mapping::{asynchronous::AsyncEndpointsMapping, synchronous::SyncEndpointsMapping};
pub use crate::app::middlewares::{Next, mapping::asynchronous::AsyncMiddlewareMapping};
pub use crate::app::results::{HttpResponse, HttpResult, HttpHeaders, Results, ResponseContext};
pub use crate::app::request::{HttpRequest, RequestParams, payload::Payload, params::Params, cancel::Cancel, file::File};
pub use crate::app::body::BoxBody;

// Exposing shortcut for CancellationToken for convenience
pub use tokio_util::sync::CancellationToken;