//! # Volga
//!
//! > Fast, Easy, and very flexible Web Framework for Rust based on [Tokio](https://tokio.rs/) runtime and [hyper](https://hyper.rs/) for fun and painless microservices crafting.
//!
//! ## Features
//! * Supports HTTP/1 and HTTP/2
//! * Robust routing
//! * Custom middlewares
//! * Full [Tokio](https://tokio.rs/) compatibility
//! * Runs on stable Rust 1.80+
//! 
//! ## Example
//! ```toml
//! [dependencies]
//! volga = "0.3.2"
//! tokio = "1.41.1"
//! ```
//! ```no_run
//!use volga::*;
//! 
//!#[tokio::main]
//!async fn main() -> std::io::Result<()> {
//!    // Start the server
//!    let mut app = App::build("127.0.0.1:7878").await?;
//! 
//!    // Example of asynchronous request handler
//!    app.map_get("/hello/{name}", |req| async move {
//!         let name = req.param("name")?;
//!         ok!("Hello {}!", name)
//!    });
//!     
//!    app.run().await
//! }
//! ```

pub mod app;

#[cfg(test)]
pub mod test_utils;

pub use crate::app::App;
pub use crate::app::results::{HttpResponse, HttpResult, HttpHeaders, Results, ResponseContext};
pub use crate::app::request::{HttpRequest, RequestParams, params::Params, cancel::Cancel};

#[cfg(feature = "middleware")]
pub use crate::app::http_context::HttpContext;

#[cfg(feature = "middleware")]
pub use crate::app::middlewares::{Next, mapping::asynchronous::AsyncMiddlewareMapping};

#[cfg(feature = "async")]
pub use crate::app::endpoints::mapping::asynchronous::AsyncEndpointsMapping;
#[cfg(feature = "sync")]
pub use crate::app::endpoints::mapping::synchronous::SyncEndpointsMapping;

#[cfg(feature = "async")]
pub use crate::app::request::payload::Payload;
#[cfg(feature = "sync")]
pub use crate::app::request::payload::SyncPayload;

#[cfg(feature = "async")]
pub use crate::app::request::file::File;
#[cfg(feature = "sync")]
pub use crate::app::request::file::SyncFile;

pub use crate::app::body::BoxBody;

// Exposing shortcut for CancellationToken for convenience
pub use tokio_util::sync::CancellationToken;