use std::sync::Arc;
use bytes::Bytes;
use http::{Method, Request, Response};

pub trait SyncMapping {
    fn map<F>(&mut self, method: Method, pattern: &str, handler: F)
    where
        F: Fn(Arc<Request<Bytes>>) -> http::Result<Response<Bytes>> + Send + Sync + 'static;
}

pub trait SyncEndpointsMapping {
    async fn map_get<F>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<Request<Bytes>>) -> http::Result<Response<Bytes>> + Send + Sync + 'static;

    async fn map_post<F>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<Request<Bytes>>) -> http::Result<Response<Bytes>> + Send + Sync + 'static;

    async fn map_put<F>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<Request<Bytes>>) -> http::Result<Response<Bytes>> + Send + Sync + 'static;

    async fn map_patch<F>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<Request<Bytes>>) -> http::Result<Response<Bytes>> + Send + Sync + 'static;

    async fn map_delete<F>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<Request<Bytes>>) -> http::Result<Response<Bytes>> + Send + Sync + 'static;
}