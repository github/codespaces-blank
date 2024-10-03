use bytes::Bytes;
use std::{sync::Arc, future::Future};
use http::{Method, Request, Response};
use crate::app::endpoints::{
    Endpoints,
    mapping::{asynchronous::AsyncMapping, synchronous::SyncMapping},
    handlers::{Handler, SyncHandler, AsyncHandler}
};

pub mod asynchronous;
pub mod synchronous;

impl AsyncMapping for Endpoints  {
    #[inline]
    fn map<F, Fut>(&mut self, method: Method, pattern: &str, handler: F)
    where
        F: Fn(Arc<Request<Bytes>>) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = http::Result<Response<Bytes>>> + Send + 'static,
    {
        let handler = Arc::new(AsyncHandler(handler)) as Arc<dyn Handler + Send + Sync>;
        self.map_route(method, pattern, handler);
    }
}

impl SyncMapping for Endpoints {
    #[inline]
    fn map<F>(&mut self, method: Method, pattern: &str, handler: F)
    where
        F: Fn(Arc<Request<Bytes>>) -> http::Result<Response<Bytes>> + Send + Sync + 'static,
    {
        let handler = Arc::new(SyncHandler(handler)) as Arc<dyn Handler + Send + Sync>;
        self.map_route(method, pattern, handler);
    }
}