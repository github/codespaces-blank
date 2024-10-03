use bytes::Bytes;
use http::Response;
use std::{pin::Pin, sync::Arc, future::Future};
use crate::app::{
    HttpContext,
    middlewares::{Middlewares, mapping::asynchronous::AsyncMapping}
};

pub mod asynchronous;

impl AsyncMapping for Middlewares {
    fn use_middleware<F, Fut>(&mut self, middleware: F)
    where
        F: 'static + Send + Sync + Fn(Arc<HttpContext>, Arc<dyn Fn(Arc<HttpContext>) -> Pin<Box<dyn Future<Output = http::Result<Response<Bytes>>> + Send>> + Send + Sync>) -> Fut,
        Fut: Future<Output = http::Result<Response<Bytes>>> + Send + 'static,
    {
        let middleware = Arc::new(middleware); // wrapping the middleware into an Arc
        let mw = Arc::new(move |ctx: Arc<HttpContext>, next: Arc<dyn Fn(Arc<HttpContext>) -> Pin<Box<dyn Future<Output = http::Result<Response<Bytes>>> + Send>> + Send + Sync>| {
            let middleware = middleware.clone(); // cloning for each invocation

            Box::pin(async move {
                // Here, middleware() can be invoked repeatedly because it’s wrapped in an Arc and cloned.
                middleware(ctx, next).await
            }) as Pin<Box<dyn Future<Output = http::Result<Response<Bytes>>> + Send>>
        });
        self.pipeline.push(mw);
    }
}