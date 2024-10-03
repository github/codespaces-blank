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
    async fn use_middleware<F, Fut>(&mut self, handler: F)
    where
        F: 'static + Send + Sync + Fn(Arc<HttpContext>, Next) -> Fut,
        Fut: Future<Output = http::Result<Response<Bytes>>> + Send + 'static;
}