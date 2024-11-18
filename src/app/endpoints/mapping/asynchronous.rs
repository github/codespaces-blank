use crate::{HttpResult, HttpRequest};
use std::future::Future;
use hyper::Method;

pub trait AsyncMapping {
    fn map<F, Fut>(&mut self, method: Method, pattern: &str, handler: F)
    where
        F: Fn(HttpRequest) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = HttpResult> + Send + 'static;
}

pub trait AsyncEndpointsMapping {
    /// Adds a request handler that matches HTTP GET requests for the specified pattern.
    /// 
    /// # Examples
    /// ```no_run
    ///use volga::{App, AsyncEndpointsMapping, Results};
    ///
    ///#[tokio::main]
    ///async fn main() -> std::io::Result<()> {
    ///    let mut app = App::build("127.0.0.1:7878").await?;
    ///
    ///    app.map_get("/test", |_req| async {
    ///        Results::text("Pass!")
    ///    });
    ///
    ///    app.run().await
    ///}
    /// ```
    fn map_get<F, Fut>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(HttpRequest) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = HttpResult> + Send + 'static;

    /// Adds a request handler that matches HTTP POST requests for the specified pattern.
    /// 
    /// # Examples
    /// ```no_run
    ///use volga::{App, AsyncEndpointsMapping, Results};
    ///
    ///#[tokio::main]
    ///async fn main() -> std::io::Result<()> {
    ///    let mut app = App::build("127.0.0.1:7878").await?;
    ///
    ///    app.map_post("/test", |_req| async {
    ///        Results::text("Pass!")
    ///    });
    ///
    ///    app.run().await
    ///}
    /// ```
    fn map_post<F, Fut>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(HttpRequest) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = HttpResult> + Send + 'static;

    /// Adds a request handler that matches HTTP PUT requests for the specified pattern.
    /// 
    /// # Examples
    /// ```no_run
    ///use volga::{App, AsyncEndpointsMapping, Results};
    ///
    ///#[tokio::main]
    ///async fn main() -> std::io::Result<()> {
    ///    let mut app = App::build("127.0.0.1:7878").await?;
    ///
    ///    app.map_put("/test", |_req| async {
    ///        Results::text("Pass!")
    ///    });
    ///
    ///    app.run().await
    ///}
    /// ```
    fn map_put<F, Fut>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(HttpRequest) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = HttpResult> + Send + 'static;

    /// Adds a request handler that matches HTTP DELETE requests for the specified pattern.
    /// 
    /// # Examples
    /// ```no_run
    ///use volga::{App, AsyncEndpointsMapping, Results};
    ///
    ///#[tokio::main]
    ///async fn main() -> std::io::Result<()> {
    ///    let mut app = App::build("127.0.0.1:7878").await?;
    ///
    ///    app.map_delete("/test", |_req| async {
    ///        Results::text("Pass!")
    ///    });
    ///
    ///    app.run().await
    ///}
    /// ```
    fn map_delete<F, Fut>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(HttpRequest) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = HttpResult> + Send + 'static;

    /// Adds a request handler that matches HTTP PATCH requests for the specified pattern.
    /// 
    /// # Examples
    /// ```no_run
    ///use volga::{App, AsyncEndpointsMapping, Results};
    ///
    ///#[tokio::main]
    ///async fn main() -> std::io::Result<()> {
    ///    let mut app = App::build("127.0.0.1:7878").await?;
    ///
    ///    app.map_patch("/test", |_req| async {
    ///        Results::text("Pass!")
    ///    });
    ///
    ///    app.run().await
    ///}
    /// ```
    fn map_patch<F, Fut>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(HttpRequest) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = HttpResult> + Send + 'static;
}