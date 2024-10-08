use std::sync::Arc;
use http::Method;
use crate::{App, SyncEndpointsMapping, HttpRequest, HttpResponse};
use crate::app::endpoints::mapping::synchronous::SyncMapping;

impl SyncEndpointsMapping for App {
    async fn map_get<F>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<HttpRequest>) -> http::Result<HttpResponse> + Send + Sync + 'static,
    {
        let mut endpoints_guard = self.endpoints.lock().await;
        SyncMapping::map(&mut *endpoints_guard, Method::GET, pattern, handler);
    }

    async fn map_post<F>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<HttpRequest>) -> http::Result<HttpResponse> + Send + Sync + 'static,
    {
        let mut endpoints_guard = self.endpoints.lock().await;
        SyncMapping::map(&mut *endpoints_guard, Method::GET, pattern, handler);
    }

    async fn map_put<F>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<HttpRequest>) -> http::Result<HttpResponse> + Send + Sync + 'static,
    {
        let mut endpoints_guard = self.endpoints.lock().await;
        SyncMapping::map(&mut *endpoints_guard, Method::GET, pattern, handler);
    }

    async fn map_patch<F>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<HttpRequest>) -> http::Result<HttpResponse> + Send + Sync + 'static,
    {
        let mut endpoints_guard = self.endpoints.lock().await;
        SyncMapping::map(&mut *endpoints_guard, Method::GET, pattern, handler);
    }

    async fn map_delete<F>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<HttpRequest>) -> http::Result<HttpResponse> + Send + Sync + 'static,
    {
        let mut endpoints_guard = self.endpoints.lock().await;
        SyncMapping::map(&mut *endpoints_guard, Method::GET, pattern, handler);
    }
}