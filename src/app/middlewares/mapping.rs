use std::{pin::Pin, sync::Arc, future::Future};
use crate::{
    HttpResult,
    HttpContext,
    Next,
    app::middlewares::{Middlewares, mapping::asynchronous::AsyncMapping},
    app::BoxedHttpResultFuture
};

pub mod asynchronous;

impl AsyncMapping for Middlewares {
    fn use_middleware<F, Fut>(&mut self, middleware: F)
    where
        F: 'static + Send + Sync + Fn(Arc<HttpContext>, Next) -> Fut,
        Fut: Future<Output = HttpResult> + Send + 'static,
    {
        let middleware = Arc::new(middleware); // wrapping the middleware into an Arc
        let mw = Arc::new(move |ctx: Arc<HttpContext>, next: Next| {
            let middleware = middleware.clone(); // cloning for each invocation

            Box::pin(async move {
                // Here, middleware() can be invoked repeatedly because it’s wrapped in an Arc and cloned.
                middleware(ctx, next).await
            }) as Pin<BoxedHttpResultFuture>
        });
        
        self.pipeline.push(mw);
    }
}