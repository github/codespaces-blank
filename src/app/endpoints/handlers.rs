use std::{sync::Arc, future::Future};
use futures_util::future::BoxFuture;
use crate::{HttpResult, HttpRequest};

pub(crate) type RouteHandler = Arc<dyn Handler + Send + Sync>;

// Encapsulates the complexity of async and sync handlers
pub(crate) trait Handler {
    fn call(&self, req: HttpRequest) -> BoxFuture<HttpResult>;
}

#[cfg(feature = "async")]
pub(crate) struct AsyncHandler<F>(pub F);

#[cfg(feature = "async")]
impl<F, Fut> Handler for AsyncHandler<F>
where
    F: Fn(HttpRequest) -> Fut,
    Fut: Future<Output = HttpResult> + Send + 'static,
{
    fn call(&self, req: HttpRequest) -> BoxFuture<HttpResult> {
        Box::pin(self.0(req))
    }
}

#[cfg(feature = "sync")]
pub(crate) struct SyncHandler<F>(pub F);

#[cfg(feature = "sync")]
impl<F> Handler for SyncHandler<F>
where
    F: Fn(HttpRequest) -> HttpResult,
{
    fn call(&self, req: HttpRequest) -> BoxFuture<HttpResult> {
        let response = self.0(req);
        Box::pin(async move { response })
    }
}