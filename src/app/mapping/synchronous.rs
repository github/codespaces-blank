use std::sync::Arc;
use bytes::Bytes;
use http::{Method, Request, Response};

use crate::app::App;
use crate::app::endpoints::mapping::{
    synchronous::{SyncMapping, SyncEndpointsMapping}
};

impl SyncEndpointsMapping for App {
    async fn map_get<F>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<Request<Bytes>>) -> http::Result<Response<Bytes>> + Send + Sync + 'static,
    {
        let mut endpoints_guard = self.endpoints.lock().await;
        SyncMapping::map(&mut *endpoints_guard, Method::GET, pattern, handler);
    }

    async fn map_post<F>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<Request<Bytes>>) -> http::Result<Response<Bytes>> + Send + Sync + 'static,
    {
        let mut endpoints_guard = self.endpoints.lock().await;
        SyncMapping::map(&mut *endpoints_guard, Method::GET, pattern, handler);
    }

    async fn map_put<F>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<Request<Bytes>>) -> http::Result<Response<Bytes>> + Send + Sync + 'static,
    {
        let mut endpoints_guard = self.endpoints.lock().await;
        SyncMapping::map(&mut *endpoints_guard, Method::GET, pattern, handler);
    }

    async fn map_patch<F>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<Request<Bytes>>) -> http::Result<Response<Bytes>> + Send + Sync + 'static,
    {
        let mut endpoints_guard = self.endpoints.lock().await;
        SyncMapping::map(&mut *endpoints_guard, Method::GET, pattern, handler);
    }

    async fn map_delete<F>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<Request<Bytes>>) -> http::Result<Response<Bytes>> + Send + Sync + 'static,
    {
        let mut endpoints_guard = self.endpoints.lock().await;
        SyncMapping::map(&mut *endpoints_guard, Method::GET, pattern, handler);
    }
}