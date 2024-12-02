use std::collections::HashMap;

use hyper::Method;

use crate::HttpRequest;
use crate::app::endpoints::{
    route::Route,
    handlers::RouteHandler
};

pub(crate) mod handlers;
pub(super) mod route;
pub mod args;

/// Describes a mapping between HTTP Verbs, routes and request handlers
pub(crate) struct Endpoints {
    routes: HashMap<Method, Route>
}

/// Describes a context of the executing route
pub(crate) struct EndpointContext {
    pub(crate) handler: RouteHandler,
    pub(crate) params: Vec<(String, String)>
}

impl EndpointContext {
    pub(crate) fn into_parts(self) -> (RouteHandler, Vec<(String, String)>) {
        (self.handler, self.params)
    }
}

impl Endpoints {
    pub(super) fn new() -> Self {
        Self { routes: HashMap::new() }
    }

    /// Gets a context of the executing route by its `HttpRequest`
    #[inline]
    pub(crate) async fn get_endpoint(&self, request: &HttpRequest) -> Option<EndpointContext> {
        let uri = request.uri();

        let path_segments = Self::split_path(uri.path());
        self.routes
            .get(request.method())
            .and_then(|router| router.find(&path_segments))
            .and_then(|route_params| {
                match route_params.route {
                    Route::Handler(handler) => Some(EndpointContext { handler: handler.clone(), params: route_params.params }),
                    _ => None
                }
            })
    }

    /// Maps the request handler to the current HTTP Verb and route pattern
    #[inline]
    pub(super) fn map_route(&mut self, method: Method, pattern: &str, handler: RouteHandler) {
        let path_segments = Self::split_path(pattern);
        self.routes.entry(method)
            .or_insert_with(|| Route::Static(HashMap::new()))
            .insert(&path_segments, handler);
    }

    #[inline]
    fn split_path(path: &str) -> Vec<String> {
        path.trim_matches('/')
            .split('/')
            .map(|s| s.to_string())
            .collect()
    }
}