use std::future::Future;
use crate::{
    HttpContext, 
    HttpResult, 
    Next
};

pub trait AsyncMapping {
    fn use_middleware<F, Fut>(&mut self, middleware: F)
    where
        F: Fn(HttpContext, Next) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = HttpResult> + Send;
}

pub trait AsyncMiddlewareMapping {
    /// Adds a middleware handler to the application request pipeline
    /// 
    /// # Examples
    /// ```no_run
    ///use volga::{App, AsyncMiddlewareMapping, Results};
    ///
    ///#[tokio::main]
    ///async fn main() -> std::io::Result<()> {
    ///    use hyper::http::response;
    /// let mut app = App::build("127.0.0.1:7878").await?;
    ///
    ///    // Middleware 2
    ///    app.use_middleware(|ctx, next| async move {
    ///        // do something...
    ///        let response = next(ctx).await;
    ///        // do something...
    ///        response
    ///    });
    /// 
    ///    // Middleware 2
    ///    app.use_middleware(|ctx, next| async move {
    ///        next(ctx).await
    ///    });
    ///
    ///    app.run().await
    ///}
    /// ```
    fn use_middleware<F, Fut>(&mut self, handler: F)
    where
        F: Fn(HttpContext, Next) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = HttpResult> + Send;
}