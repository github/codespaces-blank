use std::{pin::Pin, sync::Arc, future::Future};
use crate::{HttpResponse, HttpRequest};

pub(crate) type RouteHandler = Arc<dyn Handler + Send + Sync>;

pub(crate) trait Handler {
    fn call(&self, req: Arc<HttpRequest>) -> Pin<Box<dyn Future<Output = http::Result<HttpResponse>> + Send>>;
}

// Encapsulates the complexity of async and sync handlers
pub(crate) struct AsyncHandler<F>(pub F);

impl<F, Fut> Handler for AsyncHandler<F>
where
    F: Fn(Arc<HttpRequest>) -> Fut + Send + Sync + 'static,
    Fut: Future<Output = http::Result<HttpResponse>> + Send + 'static,
{
    fn call(&self, req: Arc<HttpRequest>) -> Pin<Box<dyn Future<Output = http::Result<HttpResponse>> + Send>> {
        Box::pin(self.0(req))
    }
}

pub(crate) struct SyncHandler<F>(pub F);

impl<F> Handler for SyncHandler<F>
where
    F: Fn(Arc<HttpRequest>) -> http::Result<HttpResponse> + Send + Sync + 'static,
{
    fn call(&self, req: Arc<HttpRequest>) -> Pin<Box<dyn Future<Output = http::Result<HttpResponse>> + Send>> {
        let response = self.0(req);
        Box::pin(async move { response })
    }
}