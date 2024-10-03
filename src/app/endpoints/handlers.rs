use bytes::Bytes;
use http::{Request, Response};
use std::{pin::Pin, sync::Arc, future::Future};

pub(crate) type RouteHandler = Arc<dyn Handler + Send + Sync>;

pub(crate) trait Handler {
    fn call(&self, req: Arc<Request<Bytes>>) -> Pin<Box<dyn Future<Output = http::Result<Response<Bytes>>> + Send>>;
}

// Encapsulates the complexity of async and sync handlers
pub(crate) struct AsyncHandler<F>(pub F);

impl<F, Fut> Handler for AsyncHandler<F>
where
    F: Fn(Arc<Request<Bytes>>) -> Fut + Send + Sync + 'static,
    Fut: Future<Output = http::Result<Response<Bytes>>> + Send + 'static,
{
    fn call(&self, req: Arc<Request<Bytes>>) -> Pin<Box<dyn Future<Output = http::Result<Response<Bytes>>> + Send>> {
        Box::pin(self.0(req))
    }
}

pub(crate) struct SyncHandler<F>(pub F);

impl<F> Handler for SyncHandler<F>
where
    F: Fn(Arc<Request<Bytes>>) -> http::Result<Response<Bytes>> + Send + Sync + 'static,
{
    fn call(&self, req: Arc<Request<Bytes>>) -> Pin<Box<dyn Future<Output = http::Result<Response<Bytes>>> + Send>> {
        let response = self.0(req);
        Box::pin(async move { response })
    }
}