use bytes::Bytes;
use http::Response;
use std::{pin::Pin, sync::Arc, future::Future};
use crate::app::{HttpContext, middlewares::Next};

pub trait AsyncMapping {
    fn use_middleware<F, Fut>(&mut self, middleware: F)
    where
        F: 'static + Send + Sync + Fn(Arc<HttpContext>, Arc<dyn Fn(Arc<HttpContext>) -> Pin<Box<dyn Future<Output = http::Result<Response<Bytes>>> + Send>> + Send + Sync>) -> Fut,
        Fut: Future<Output = http::Result<Response<Bytes>>> + Send + 'static;
}

pub trait AsyncMiddlewareMapping {
    /// Adds a middleware handler to the application request pipeline
    /// 
    /// # Examples
    /// ```no_run
    ///use volga::{App, AsyncMiddlewareMapping, Results};
    ///
    ///#[tokio::main]
    ///async fn main() -> tokio::io::Result<()> {
    ///    let mut app = App::build("127.0.0.1:7878").await?;
    ///
    ///    app.use_middleware(|ctx, next| async move {
    ///        next(ctx).await
    ///    }).await;
    ///
    ///    app.run().await
    ///}
    /// ```
    fn use_middleware<F, Fut>(&mut self, handler: F) -> impl Future<Output = ()> + Send
    where
        F: 'static + Send + Sync + Fn(Arc<HttpContext>, Next) -> Fut,
        Fut: Future<Output = http::Result<Response<Bytes>>> + Send + 'static;
}