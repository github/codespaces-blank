use std::collections::HashMap;
use std::sync::Arc;
use hyper::Method;
use crate::HttpRequest;
use crate::app::endpoints::{
    route::Route,
    handlers::RouteHandler
};

pub(crate) mod handlers;
pub(crate) mod route;

pub mod mapping;

pub(crate) struct Endpoints {
    routes: HashMap<Method, Route>
}

pub(crate) struct EndpointContext {
    pub(crate) handler: RouteHandler,
    pub(crate) params: Arc<HashMap<String, String>>
}

impl Endpoints {
    pub(crate) fn new() -> Self {
        Self {
            routes: HashMap::new()
        }
    }

    #[inline]
    pub(crate) async fn get_endpoint(&self, request: &HttpRequest) -> Option<EndpointContext> {
        let uri = request.uri();

        let mut query_map = HashMap::new();
        if let Some(query_str) = uri.query() {
            query_map = query_str
                .split('&')
                .filter_map(|x| x.split_once('='))
                .map(|(key, value)| (String::from(key), String::from(value)))
                .collect();
        }

        let path_segments = Self::split_path(uri.path());
        self.routes
            .get(request.method())
            .and_then(|router| router.find(&path_segments))
            .and_then(|mut route_params| {
                route_params.params.extend(query_map);
                match route_params.route {
                    Route::Handler(handler) => Some(EndpointContext { handler: handler.clone(), params: Arc::new(route_params.params) }),
                    _ => None
                }
            })
    }

    #[inline]
    fn map_route(&mut self, method: Method, pattern: &str, handler: RouteHandler) {
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