use std::sync::Arc;

use hyper::Method;

use crate::app::endpoints::args::FromRequest;
use crate::app::endpoints::handlers::GenericHandler;
use crate::{App, HttpResult};

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
}

impl Router for App {
    fn map_get<F, Args>(&mut self, pattern: &str, handler: F)
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static
    {
        use crate::app::endpoints::handlers::Func;

        let endpoints = self.endpoints_mut();
        let handler = Arc::new(Func::new(handler));
        endpoints.map_route(Method::GET, pattern, handler);
    }

    fn map_post<F, Args>(&mut self, pattern: &str, handler: F)
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static,
    {
        use crate::app::endpoints::handlers::Func;

        let endpoints = self.endpoints_mut();
        let handler = Arc::new(Func::new(handler));
        endpoints.map_route(Method::POST, pattern, handler);
    }

    fn map_put<F, Args>(&mut self, pattern: &str, handler: F)
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static,
    {
        use crate::app::endpoints::handlers::Func;

        let endpoints = self.endpoints_mut();
        let handler = Arc::new(Func::new(handler));
        endpoints.map_route(Method::PUT, pattern, handler);
    }

    fn map_patch<F, Args>(&mut self, pattern: &str, handler: F)
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static,
    {
        use crate::app::endpoints::handlers::Func;

        let endpoints = self.endpoints_mut();
        let handler = Arc::new(Func::new(handler));
        endpoints.map_route(Method::PATCH, pattern, handler);
    }

    fn map_delete<F, Args>(&mut self, pattern: &str, handler: F)
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static,
    {
        use crate::app::endpoints::handlers::Func;

        let endpoints = self.endpoints_mut();
        let handler = Arc::new(Func::new(handler));
        endpoints.map_route(Method::DELETE, pattern, handler);
    }
}