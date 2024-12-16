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
//! volga = "0.4.3"
//! tokio = { version = "1", features = ["full"] }
//! ```
//! ```no_run
//! use volga::*;
//! 
//! #[tokio::main]
//! async fn main() -> std::io::Result<()> {
//!     // Start the server
//!     let mut app = App::new();
//! 
//!     // Example of request handler
//!     app.map_get("/hello/{name}", |name: String| async move {
//!          ok!("Hello {name}!")
//!     });
//!     
//!     app.run().await
//! }
//! ```

#![forbid(unsafe_code)]
#![deny(unreachable_pub)]

pub mod app;

#[cfg(test)]
pub mod test_utils;

pub use crate::app::{App, router::Router, body::{BoxBody, HttpBody}};
pub use crate::app::request::HttpRequest;
pub use crate::app::results::{
    HttpResponse, 
    HttpResult, 
    HttpHeaders, 
    Results, 
    ResponseContext,
    builder::{SERVER_NAME, RESPONSE_ERROR}
};
pub use crate::app::endpoints::args::{
    path::Path,
    json::Json,
    file::File,
    query::Query,
    headers::{self},
    cancellation_token::CancellationToken,
};

#[cfg(feature = "middleware")]
pub use crate::app::http_context::HttpContext;

#[cfg(feature = "middleware")]
pub use crate::app::middlewares::{Next, Middleware};

// Re-exporting HTTP status codes, Response and some headers from hyper/http
pub use hyper::{
    StatusCode, 
    Response, 
    header::{    
        CONTENT_DISPOSITION,
        TRANSFER_ENCODING,
        CONTENT_TYPE,
        CONTENT_LENGTH,
        SERVER
    }
};