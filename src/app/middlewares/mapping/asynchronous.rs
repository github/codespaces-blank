use std::{sync::Arc, future::Future};
use crate::{HttpContext, HttpResult, Next};

pub trait AsyncMapping {
    fn use_middleware<F, Fut>(&mut self, middleware: F)
    where
        F: 'static + Send + Sync + Fn(Arc<HttpContext>, Next) -> Fut,
        Fut: Future<Output = HttpResult> + Send + 'static;
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
    ///    let mut app = App::build("127.0.0.1:7878").await?;
    ///
    ///    app.use_middleware(|ctx, next| async move {
    ///        next(ctx).await
    ///    });
    ///
    ///    app.run().await
    ///}
    /// ```
    fn use_middleware<F, Fut>(&mut self, handler: F)
    where
        F: 'static + Send + Sync + Fn(Arc<HttpContext>, Next) -> Fut,
        Fut: Future<Output = HttpResult> + Send + 'static;
}