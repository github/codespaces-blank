use std::{sync::Arc, future::Future};
use http::Method;
use crate::{
    App, 
    HttpResult, 
    HttpRequest, 
    HttpContext, 
    Next,
    AsyncMiddlewareMapping, 
    AsyncEndpointsMapping
};

impl AsyncEndpointsMapping for App {
    fn map_get<F, Fut>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<HttpRequest>) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = HttpResult> + Send + 'static,
    {
        use crate::app::endpoints::mapping::asynchronous::AsyncMapping;

        let endpoints = self.endpoints();
        endpoints.map(Method::GET, pattern, handler);
    }

    fn map_post<F, Fut>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<HttpRequest>) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = HttpResult> + Send + 'static,
    {
        use crate::app::endpoints::mapping::asynchronous::AsyncMapping;

        let endpoints = self.endpoints();
        endpoints.map(Method::POST, pattern, handler);
    }

    fn map_put<F, Fut>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<HttpRequest>) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = HttpResult> + Send + 'static,
    {
        use crate::app::endpoints::mapping::asynchronous::AsyncMapping;

        let endpoints = self.endpoints();
        endpoints.map(Method::PUT, pattern, handler);
    }

    fn map_delete<F, Fut>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<HttpRequest>) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = HttpResult> + Send + 'static,
    {
        use crate::app::endpoints::mapping::asynchronous::AsyncMapping;

        let endpoints = self.endpoints();
        endpoints.map(Method::DELETE, pattern, handler);
    }

    fn map_patch<F, Fut>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(Arc<HttpRequest>) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = HttpResult> + Send + 'static,
    {
        use crate::app::endpoints::mapping::asynchronous::AsyncMapping;

        let endpoints = self.endpoints();
        endpoints.map(Method::PATCH, pattern, handler);
    }
}

impl AsyncMiddlewareMapping for App {
    fn use_middleware<F, Fut>(&mut self, handler: F)
    where
        F: 'static + Send + Sync + Fn(Arc<HttpContext>, Next) -> Fut,
        Fut: Future<Output = HttpResult> + Send + 'static,
    {
        use crate::app::middlewares::mapping::asynchronous::AsyncMapping;

        let middlewares = self.middlewares();
        middlewares.use_middleware(handler);
    }
}