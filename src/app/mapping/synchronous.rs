use hyper::Method;
use crate::{App, SyncEndpointsMapping, HttpRequest, HttpResult};
use crate::app::endpoints::mapping::synchronous::SyncMapping;

impl SyncEndpointsMapping for App {
    fn map_get<F>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(HttpRequest) -> HttpResult + Send + Sync + 'static,
    {
        let endpoints = self.endpoints_mut();
        endpoints.map(Method::GET, pattern, handler);
    }

    fn map_post<F>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(HttpRequest) -> HttpResult + Send + Sync + 'static,
    {
        let endpoints = self.endpoints_mut();
        endpoints.map(Method::POST, pattern, handler);
    }

    fn map_put<F>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(HttpRequest) -> HttpResult + Send + Sync + 'static,
    {
        let endpoints = self.endpoints_mut();
        endpoints.map(Method::PUT, pattern, handler);
    }

    fn map_patch<F>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(HttpRequest) -> HttpResult + Send + Sync + 'static,
    {
        let endpoints = self.endpoints_mut();
        endpoints.map(Method::PATCH, pattern, handler);
    }

    fn map_delete<F>(&mut self, pattern: &str, handler: F)
    where
        F: Fn(HttpRequest) -> HttpResult + Send + Sync + 'static,
    {
        let endpoints = self.endpoints_mut();
        endpoints.map(Method::DELETE, pattern, handler);
    }
}