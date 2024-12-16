use hyper::Method;

use crate::{App, HttpResult};
use crate::app::endpoints::{
    args::FromRequest,
    handlers::{Func, GenericHandler}
};

/// Declares a set ot methods that map routes to a specific pattern and HTTP Verb
/// 
/// # Examples
/// ```no_run
/// use volga::{App, Router, ok};
///
/// #[tokio::main]
/// async fn main() -> std::io::Result<()> {
///     let mut app = App::new();
/// 
///     app.map_get("/hello", || async {
///         ok!("Hello World!")
///     });
/// 
///     app.run().await
/// }
/// ```
pub trait Router {
    /// Adds a request handler that matches HTTP GET requests for the specified pattern.
    /// 
    /// # Examples
    /// ```no_run
    /// use volga::{App, Router, ok};
    ///
    ///# #[tokio::main]
    ///# async fn main() -> std::io::Result<()> {
    /// let mut app = App::new();
    /// 
    /// app.map_get("/hello", || async {
    ///    ok!("Hello World!")
    /// });
    ///# app.run().await
    ///# }
    /// ```
    fn map_get<F, Args>(&mut self, pattern: &str, handler: F)
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static;

    /// Adds a request handler that matches HTTP POST requests for the specified pattern.
    /// 
    /// # Examples
    /// ```no_run
    /// use volga::{App, Router, File, ok};
    ///
    ///# #[tokio::main]
    ///# async fn main() -> std::io::Result<()> {
    /// let mut app = App::new();
    /// 
    /// app.map_post("/upload", |file: File| async move {
    ///     file.save("example.txt").await?;
    ///     ok!()
    /// });
    ///# app.run().await
    ///# }
    /// ```
    fn map_post<F, Args>(&mut self, pattern: &str, handler: F)
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static;

    /// Adds a request handler that matches HTTP PUT requests for the specified pattern.
    /// 
    /// # Examples
    /// ```no_run
    /// use volga::{App, Router, ok};
    ///
    ///# #[tokio::main]
    ///# async fn main() -> std::io::Result<()> {
    /// let mut app = App::new();
    /// 
    /// app.map_put("/hello", || async {
    ///    ok!("Hello World!")
    /// });
    ///# app.run().await
    ///# }
    /// ```
    fn map_put<F, Args>(&mut self, pattern: &str, handler: F)
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static;

    /// Adds a request handler that matches HTTP PATCH requests for the specified pattern.
    /// 
    /// # Examples
    /// ```no_run
    /// use volga::{App, Router, ok};
    ///
    ///# #[tokio::main]
    ///# async fn main() -> std::io::Result<()> {
    /// let mut app = App::new();
    /// 
    /// app.map_patch("/hello", || async {
    ///    ok!("Hello World!")
    /// });
    ///# app.run().await
    ///# }
    /// ```
    fn map_patch<F, Args>(&mut self, pattern: &str, handler: F)
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static;

    /// Adds a request handler that matches HTTP DELETE requests for the specified pattern.
    /// 
    /// # Examples
    /// ```no_run
    /// use volga::{App, Router, ok};
    ///
    ///# #[tokio::main]
    ///# async fn main() -> std::io::Result<()> {
    /// let mut app = App::new();
    /// 
    /// app.map_delete("/delete/{id}", |id: i32| async move {
    ///    ok!("Item with ID: {} has been removed!", id)
    /// });
    ///# app.run().await
    ///# }
    /// ```
    fn map_delete<F, Args>(&mut self, pattern: &str, handler: F)
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static;

    /// Adds a request handler that matches HTTP HEAD requests for the specified pattern.
    /// 
    /// # Examples
    /// ```no_run
    /// use volga::{App, Router, ok};
    ///
    ///# #[tokio::main]
    ///# async fn main() -> std::io::Result<()> {
    /// let mut app = App::new();
    /// 
    /// app.map_head("/resource/{id}", |id: i32| async move {
    ///    ok!([("Custom-Header", "value")])
    /// });
    ///# app.run().await
    ///# }
    /// ```
    fn map_head<F, Args>(&mut self, pattern: &str, handler: F)
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static;

    /// Adds a request handler that matches HTTP OPTIONS requests for the specified pattern.
    /// 
    /// # Examples
    /// ```no_run
    /// use volga::{App, Router, ok};
    ///
    ///# #[tokio::main]
    ///# async fn main() -> std::io::Result<()> {
    /// let mut app = App::new();
    /// 
    /// app.map_options("/resource/{id}", |id: i32| async move {
    ///    ok!([("Allow", "GET, HEAD, POST, OPTIONS")])
    /// });
    ///# app.run().await
    ///# }
    /// ```
    fn map_options<F, Args>(&mut self, pattern: &str, handler: F)
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static;

    /// Adds a request handler that matches HTTP TRACE requests for the specified pattern.
    /// 
    /// # Examples
    /// ```no_run
    /// use volga::{App, Router, ok};
    ///
    ///# #[tokio::main]
    ///# async fn main() -> std::io::Result<()> {
    /// let mut app = App::new();
    /// 
    /// app.map_trace("/", |id: i32| async move {
    ///    ok!([("content-type", "message/http")])
    /// });
    ///# app.run().await
    ///# }
    /// ```
    fn map_trace<F, Args>(&mut self, pattern: &str, handler: F)
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static;
}

impl Router for App {
    fn map_get<F, Args>(&mut self, pattern: &str, handler: F)
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static
    {
        let handler = Func::new(handler);
        let endpoints = self.endpoints_mut();
        endpoints.map_route(Method::GET, pattern, handler.clone());
        
        let head = Method::HEAD;
        if !endpoints.contains(&head, pattern) { 
            endpoints.map_route(head, pattern, handler.clone());
        } 
    }

    fn map_post<F, Args>(&mut self, pattern: &str, handler: F)
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static,
    {
        let handler = Func::new(handler);
        self.endpoints_mut().map_route(Method::POST, pattern, handler);
    }

    fn map_put<F, Args>(&mut self, pattern: &str, handler: F)
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static,
    {
        let handler = Func::new(handler);
        self.endpoints_mut().map_route(Method::PUT, pattern, handler);
    }

    fn map_patch<F, Args>(&mut self, pattern: &str, handler: F)
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static,
    {
        let handler = Func::new(handler);
        self.endpoints_mut().map_route(Method::PATCH, pattern, handler);
    }

    fn map_delete<F, Args>(&mut self, pattern: &str, handler: F)
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static,
    {
        let handler = Func::new(handler);
        self.endpoints_mut().map_route(Method::DELETE, pattern, handler);
    }

    fn map_head<F, Args>(&mut self, pattern: &str, handler: F)
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static,
    {
        let handler = Func::new(handler);
        self.endpoints_mut().map_route(Method::HEAD, pattern, handler);
    }

    fn map_options<F, Args>(&mut self, pattern: &str, handler: F)
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static,
    {
        let handler = Func::new(handler);
        self.endpoints_mut().map_route(Method::OPTIONS, pattern, handler);
    }

    fn map_trace<F, Args>(&mut self, pattern: &str, handler: F)
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static,
    {
        let handler = Func::new(handler);
        self.endpoints_mut().map_route(Method::TRACE, pattern, handler);
    }
}