use std::sync::Arc;
use bytes::Bytes;
use http::{Method, Request, Response};

pub trait SyncMapping {
    fn map<F>(&mut self, method: Method, pattern: &str, handler: F)
    where
        F: Fn(Arc<Request<Bytes>>) -> http::Result<Response<Bytes>> + Send + Sync + 'static;
}

pub trait SyncEndpointsMapping {
    /// Adds a request handler that matches HTTP GET requests for the specified pattern.
    /// 
    /// # Examples
    /// ```no_run
    ///use volga::{App, SyncEndpointsMapping, Results};
    ///
    ///#[tokio::main]
    ///async fn main() -> tokio::io::Result<()> {
    ///    let mut app = App::build("127.0.0.1:7878").await?;
    ///
    ///    app.map_get("/test", |_req| {
    ///        Results::text("Pass!")
    ///    }).await;
    ///
    ///    app.run().await
    ///}
    /// ```
    fn map_get<F>(&mut self, pattern: &str, handler: F) -> impl std::future::Future<Output = ()> + Send
    where
        F: Fn(Arc<Request<Bytes>>) -> http::Result<Response<Bytes>> + Send + Sync + 'static;

    /// Adds a request handler that matches HTTP POST requests for the specified pattern.
    /// 
    /// # Examples
    /// ```no_run
    ///use volga::{App, SyncEndpointsMapping, Results};
    ///
    ///#[tokio::main]
    ///async fn main() -> tokio::io::Result<()> {
    ///    let mut app = App::build("127.0.0.1:7878").await?;
    ///
    ///    app.map_post("/test", |_req| {
    ///        Results::text("Pass!")
    ///    }).await;
    ///
    ///    app.run().await
    ///}
    /// ```
    fn map_post<F>(&mut self, pattern: &str, handler: F) -> impl std::future::Future<Output = ()> + Send
    where
        F: Fn(Arc<Request<Bytes>>) -> http::Result<Response<Bytes>> + Send + Sync + 'static;

    /// Adds a request handler that matches HTTP PUT requests for the specified pattern.
    /// 
    /// # Examples
    /// ```no_run
    ///use volga::{App, SyncEndpointsMapping, Results};
    ///
    ///#[tokio::main]
    ///async fn main() -> tokio::io::Result<()> {
    ///    let mut app = App::build("127.0.0.1:7878").await?;
    ///
    ///    app.map_put("/test", |_req| {
    ///        Results::text("Pass!")
    ///    }).await;
    ///
    ///    app.run().await
    ///}
    /// ```
    fn map_put<F>(&mut self, pattern: &str, handler: F) -> impl std::future::Future<Output = ()> + Send
    where
        F: Fn(Arc<Request<Bytes>>) -> http::Result<Response<Bytes>> + Send + Sync + 'static;

    /// Adds a request handler that matches HTTP PATCH requests for the specified pattern.
    /// 
    /// # Examples
    /// ```no_run
    ///use volga::{App, SyncEndpointsMapping, Results};
    ///
    ///#[tokio::main]
    ///async fn main() -> tokio::io::Result<()> {
    ///    let mut app = App::build("127.0.0.1:7878").await?;
    ///
    ///    app.map_patch("/test", |_req| {
    ///        Results::text("Pass!")
    ///    }).await;
    ///
    ///    app.run().await
    ///}
    /// ```
    fn map_patch<F>(&mut self, pattern: &str, handler: F) -> impl std::future::Future<Output = ()> + Send
    where
        F: Fn(Arc<Request<Bytes>>) -> http::Result<Response<Bytes>> + Send + Sync + 'static;

    /// Adds a request handler that matches HTTP DELETE requests for the specified pattern.
    /// 
    /// # Examples
    /// ```no_run
    ///use volga::{App, SyncEndpointsMapping, Results};
    ///
    ///#[tokio::main]
    ///async fn main() -> tokio::io::Result<()> {
    ///    let mut app = App::build("127.0.0.1:7878").await?;
    ///
    ///    app.map_delete("/test", |_req| {
    ///        Results::text("Pass!")
    ///    }).await;
    ///
    ///    app.run().await
    ///}
    /// ```
    fn map_delete<F>(&mut self, pattern: &str, handler: F) -> impl std::future::Future<Output = ()> + Send
    where
        F: Fn(Arc<Request<Bytes>>) -> http::Result<Response<Bytes>> + Send + Sync + 'static;
}