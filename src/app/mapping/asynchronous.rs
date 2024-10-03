use bytes::Bytes;
use std::{sync::Arc, future::Future};
use http::{Method, Request, Response};

use crate::app::{
    App,
    HttpContext,
    endpoints::mapping::asynchronous::AsyncEndpointsMapping,
    middlewares::{Next, mapping::asynchronous::AsyncMiddlewareMapping}
};

impl AsyncEndpointsMapping for App {
    async fn map_get<F, Fut>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<Request<Bytes>>) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = http::Result<Response<Bytes>>> + Send + 'static,
    {
        use crate::app::endpoints::mapping::asynchronous::AsyncMapping;
        
        let mut endpoints_guard = self.endpoints.lock().await;
        AsyncMapping::map(&mut *endpoints_guard, Method::GET, pattern, handler);
    }

    async fn map_post<F, Fut>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<Request<Bytes>>) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = http::Result<Response<Bytes>>> + Send + 'static,
    {
        use crate::app::endpoints::mapping::asynchronous::AsyncMapping;
        
        let mut endpoints_guard = self.endpoints.lock().await;
        AsyncMapping::map(&mut *endpoints_guard, Method::POST, pattern, handler);
    }

    async fn map_put<F, Fut>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<Request<Bytes>>) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = http::Result<Response<Bytes>>> + Send + 'static,
    {
        use crate::app::endpoints::mapping::asynchronous::AsyncMapping;

        let mut endpoints_guard = self.endpoints.lock().await;
        AsyncMapping::map(&mut *endpoints_guard, Method::PUT, pattern, handler);
    }

    async fn map_delete<F, Fut>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<Request<Bytes>>) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = http::Result<Response<Bytes>>> + Send + 'static,
    {
        use crate::app::endpoints::mapping::asynchronous::AsyncMapping;

        let mut endpoints_guard = self.endpoints.lock().await;
        AsyncMapping::map(&mut *endpoints_guard, Method::DELETE, pattern, handler);
    }

    async fn map_patch<F, Fut>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<Request<Bytes>>) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = http::Result<Response<Bytes>>> + Send + 'static,
    {
        use crate::app::endpoints::mapping::asynchronous::AsyncMapping;

        let mut endpoints_guard = self.endpoints.lock().await;
        AsyncMapping::map(&mut *endpoints_guard, Method::PATCH, pattern, handler);
    }
}

impl AsyncMiddlewareMapping for App {
    async fn use_middleware<F, Fut>(&mut self, handler: F)
    where
        F: 'static + Send + Sync + Fn(Arc<HttpContext>, Next) -> Fut,
        Fut: Future<Output = http::Result<Response<Bytes>>> + Send + 'static,
    {
        use crate::app::middlewares::mapping::asynchronous::AsyncMapping;

        let mut middlewares_guard = self.middlewares.lock().await;
        middlewares_guard.use_middleware(handler);
    }
}