use bytes::Bytes;
use std::{sync::Arc, future::Future};
use http::{Method, Request, Response};

pub trait AsyncMapping {
    fn map<F, Fut>(&mut self, method: Method, pattern: &str, handler: F)
    where
        F: Fn(Arc<Request<Bytes>>) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = http::Result<Response<Bytes>>> + Send + 'static;
}

pub trait AsyncEndpointsMapping {
    async fn map_get<F, Fut>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<Request<Bytes>>) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = http::Result<Response<Bytes>>> + Send + 'static;

    async fn map_post<F, Fut>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<Request<Bytes>>) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = http::Result<Response<Bytes>>> + Send + 'static;

    async fn map_put<F, Fut>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<Request<Bytes>>) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = http::Result<Response<Bytes>>> + Send + 'static;

    async fn map_delete<F, Fut>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<Request<Bytes>>) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = http::Result<Response<Bytes>>> + Send + 'static;

    async fn map_patch<F, Fut>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<Request<Bytes>>) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = http::Result<Response<Bytes>>> + Send + 'static;
}