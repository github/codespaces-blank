use std::{
    sync::Arc, 
    future::Future
};
use futures_util::future::BoxFuture;
use crate::{
    app::middlewares::{Middlewares, mapping::asynchronous::AsyncMapping}, 
    HttpResult, 
    HttpContext, 
    Next
};

pub mod asynchronous;

impl AsyncMapping for Middlewares {
    fn use_middleware<F, Fut>(&mut self, middleware: F)
    where
        F: Fn(HttpContext, Next) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = HttpResult> + Send,
    {
        let middleware = Arc::new(middleware); // wrapping the middleware into an Arc
        let mw = Arc::new(move |ctx: HttpContext, next: Next| {
            let middleware = middleware.clone(); // cloning for each invocation

            Box::pin(async move {
                // Here, middleware() can be invoked repeatedly because it’s wrapped in an Arc and cloned.
                middleware(ctx, next).await
            }) as BoxFuture<HttpResult>
        });
        
        self.pipeline.push(mw);
    }
}