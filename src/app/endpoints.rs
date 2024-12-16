use std::collections::HashMap;
use hyper::{Method, Uri};

use crate::app::endpoints::{
    route::Route,
    handlers::RouteHandler,
    route::PathArguments
};

pub(crate) mod handlers;
pub(super) mod route;
pub mod args;

const ALLOW_METHOD_SEPARATOR : &str = ",";
const PATH_SEPARATOR : char = '/';

/// Describes a mapping between HTTP Verbs, routes and request handlers
pub(crate) struct Endpoints {
    //routes: HashMap<Method, Route>
    routes: Route
}

/// Specifies statuses that could be returned after route matching
pub(crate) enum RouteOption {
    RouteNotFound,
    MethodNotFound(String),
    Ok(EndpointContext)
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
    
    fn new(handler: RouteHandler, params: PathArguments) -> Self {
        Self { handler, params }
    }
}

impl Endpoints {
    pub(super) fn new() -> Self {
        Self { routes: Route::Static(HashMap::new()) }
    }

    /// Gets a context of the executing route by its `HttpRequest`
    #[inline]
    pub(crate) fn get_endpoint(&self, method: &Method, uri: &Uri) -> RouteOption {
        let path_segments = Self::split_path(uri.path());
        self.routes.find(&path_segments)
            .map_or_else(
                || RouteOption::RouteNotFound, 
                |route_params| {
                    match route_params.route {
                        Route::Handler(handlers) => {
                            handlers.get(method)
                                .map_or_else(
                                    || {
                                        let allowed: Vec<&str> = handlers
                                            .keys()
                                            .map(|k| k.as_str())
                                            .collect();
                                        RouteOption::MethodNotFound(allowed.join(ALLOW_METHOD_SEPARATOR))
                                    }, 
                                    |handler| RouteOption::Ok(EndpointContext::new(handler.clone(), route_params.params)))
                        },
                        _ => RouteOption::RouteNotFound
                    }  
                })
    }

    /// Maps the request handler to the current HTTP Verb and route pattern
    #[inline]
    pub(super) fn map_route(&mut self, method: Method, pattern: &str, handler: RouteHandler) {
        let path_segments = Self::split_path(pattern);
        self.routes.insert(&path_segments, method, handler);
    }
    
    #[inline]
    pub(super) fn contains(&mut self, method: &Method, pattern: &str) -> bool {
        let path_segments = Self::split_path(pattern);
        self.routes.find(&path_segments).and_then(|params| match &params.route {
            Route::Handler(handlers) => Some(handlers.contains_key(method)),
            _ => None,
        }).unwrap_or(false)
    }

    #[inline]
    fn split_path(path: &str) -> Vec<String> {
        path.trim_matches(PATH_SEPARATOR)
            .split(PATH_SEPARATOR)
            .map(|s| s.to_string())
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use hyper::{Method, Request};
    use crate::app::endpoints::{Endpoints, RouteOption};
    use crate::app::endpoints::handlers::Func;
    use crate::Results;

    #[test]
    fn it_maps_and_gets_endpoint() {
        let mut endpoints = Endpoints::new();
        
        let handler = Func::new(|| async { Results::ok() });
        
        endpoints.map_route(Method::POST, "path/to/handler", handler);
        
        let request = Request::post("https://example.com/path/to/handler").body(()).unwrap();
        let post_handler = endpoints.get_endpoint(request.method(), request.uri());

        match post_handler {
            RouteOption::Ok(_) => (),
            _ => panic!("`post_handler` must be is the `Ok` state")
        }
    }

    #[test]
    fn it_returns_route_not_found() {
        let mut endpoints = Endpoints::new();

        let handler = Func::new(|| async { Results::ok() });

        endpoints.map_route(Method::POST, "path/to/handler", handler);

        let request = Request::post("https://example.com/path/to/another-handler").body(()).unwrap();
        let post_handler = endpoints.get_endpoint(request.method(), request.uri());

        match post_handler {
            RouteOption::RouteNotFound => (),
            _ => panic!("`post_handler` must be is the `RouteNotFound` state")
        } 
    }

    #[test]
    fn it_returns_method_not_found() {
        let mut endpoints = Endpoints::new();

        let handler = Func::new(|| async { Results::ok() });

        endpoints.map_route(Method::GET, "path/to/handler", handler);

        let request = Request::post("https://example.com/path/to/handler").body(()).unwrap();
        let post_handler = endpoints.get_endpoint(request.method(), request.uri());

        match post_handler {
            RouteOption::MethodNotFound(allow) => assert_eq!(allow, "GET"),
            _ => panic!("`post_handler` must be is the `MethodNotFound` state")
        }
    }
    
    #[test]
    fn is_has_route_after_map() {
        let mut endpoints = Endpoints::new();

        let handler = Func::new(|| async { Results::ok() });

        endpoints.map_route(Method::GET, "path/to/handler", handler);

        let has_route = endpoints.contains(&Method::GET, "path/to/handler");
        
        assert!(has_route);
    }

    #[test]
    fn is_doesnt_have_route_after_map_a_different_one() {
        let mut endpoints = Endpoints::new();

        let handler = Func::new(|| async { Results::ok() });

        endpoints.map_route(Method::GET, "path/to/handler", handler);

        let has_route = endpoints.contains(&Method::PUT, "path/to/handler");

        assert!(!has_route);
    }
}