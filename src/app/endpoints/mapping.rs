use hyper::Method;
use std::{sync::Arc, future::Future};
use crate::{HttpResult, HttpRequest};
use crate::app::endpoints::Endpoints;

#[cfg(feature = "async")]
pub mod asynchronous;
#[cfg(feature = "sync")]
pub mod synchronous;

#[cfg(feature = "async")]
impl asynchronous::AsyncMapping for Endpoints  {
    fn map<F, Fut>(&mut self, method: Method, pattern: &str, handler: F)
    where
        F: Fn(HttpRequest) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = HttpResult> + Send + 'static,
    {
        let handler = Arc::new(crate::app::endpoints::handlers::AsyncHandler(handler));
        self.map_route(method, pattern, handler);
    }
}

#[cfg(feature = "sync")]
impl synchronous::SyncMapping for Endpoints {
    fn map<F>(&mut self, method: Method, pattern: &str, handler: F)
    where
        F: Fn(HttpRequest) -> HttpResult + Send + Sync + 'static,
    {
        let handler = Arc::new(crate::app::endpoints::handlers::SyncHandler(handler));
        self.map_route(method, pattern, handler);
    }
}