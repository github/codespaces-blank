use std::collections::HashMap;
use crate::app::endpoints::handlers::RouteHandler;

pub(super) enum Route {
    Static(HashMap<String, Route>),
    Dynamic(HashMap<String, Route>),
    Handler(RouteHandler)
}

pub(super) struct RouteParams<'route> {
    pub(super) route: &'route Route,
    pub(super) params: HashMap<String, String>
}

impl Route {
    pub(super) fn insert(&mut self, path_segments: &[String], handler: RouteHandler) {
        let mut current = self;

        for (index, segment) in path_segments.iter().enumerate() {
            let is_last = index == path_segments.len() - 1;
            let is_dynamic = Self::is_dynamic_segment(segment);

            current = match current {
                Route::Static(map) | Route::Dynamic(map) => {
                    let entry = map.entry(segment.clone()).or_insert_with(|| {
                        if is_dynamic {
                            Route::Dynamic(HashMap::new())
                        } else {
                            Route::Static(HashMap::new())
                        }
                    });

                    // Check if this segment is the last, and add the handler
                    if is_last {
                        // Assumes the inserted or existing route has HashMap as associated data
                        match entry {
                            Route::Dynamic(ref mut map) |
                            Route::Static(ref mut map) => {
                                map.insert("".to_string(), Route::Handler(handler.clone()));
                            },
                            _ => ()
                        }
                    }

                    entry // Continue traversing or inserting into this entry
                },
                Route::Handler(_) => panic!("Attempt to insert a route under a handler"),
            };
        }
    }

    pub(super) fn find(&self, path_segments: &[String]) -> Option<RouteParams> {
        let mut current = Some(self);
        let mut params: HashMap<String, String> = HashMap::new();

        for (index, segment) in path_segments.iter().enumerate() {
            let is_last = index == path_segments.len() - 1;

            current = match current {
                Some(Route::Static(map)) | Some(Route::Dynamic(map)) => {
                    // Trying direct match first
                    let direct_match = map.get(segment);

                    // If no direct match, try dynamic route resolution
                    let resolved_route = direct_match.or_else(|| {
                        map.iter()
                            .filter(|(key, _)| Self::is_dynamic_segment(key))
                            .map(|(key, route)| {
                                if let Some(param_name) = key.strip_prefix('{').and_then(|k| k.strip_suffix('}')) {
                                    params.insert(String::from(param_name), segment.clone());
                                }
                                route
                            })
                            .next()
                    });

                    // Retrieve handler or further route if this is the last segment
                    if let Some(route) = resolved_route {
                        if is_last {
                            match route {
                                Route::Dynamic(inner_map) | Route::Static(inner_map) => {
                                    // Attempt to get handler directly if no further routing is possible
                                    inner_map.get("").or(Some(route))
                                },
                                handler @ Route::Handler(_) => Some(handler), // Direct handler return
                            }
                        } else {
                            Some(route) // Continue on non-terminal routes
                        }
                    } else {
                        None // No route resolved
                    }
                },
                _ => None,
            };
        }

        current.map(|route| RouteParams { route, params })
    }

    #[inline]
    fn is_dynamic_segment(segment: &str) -> bool {
        segment.starts_with("{") && segment.ends_with("}")
    }
}

#[cfg(test)]
mod tests {
    use std::collections::HashMap;
    use std::sync::Arc;
    use crate::{ok, HttpRequest};
    use crate::app::endpoints::handlers::AsyncHandler;
    use crate::app::endpoints::route::Route;

    #[test]
    fn it_inserts_and_finds_route() {
        let handler = |_req: HttpRequest| async { ok!() };
        let handler = Arc::new(AsyncHandler(handler));
        
        let path = ["test".into()];
        
        let mut route = Route::Static(HashMap::new());
        route.insert(&path, handler);
        
        let route_params = route.find(&path);
        
        assert!(route_params.is_some());
    }

    #[test]
    fn it_inserts_and_finds_route_with_params() {
        let handler = |_req: HttpRequest| async { ok!() };
        let handler = Arc::new(AsyncHandler(handler));

        let path = ["test".into(), "{value}".into()];

        let mut route = Route::Static(HashMap::new());
        route.insert(&path, handler);

        let path = ["test".into(), "some".into()];
        
        let route_params = route.find(&path).unwrap();
        let val = route_params.params.get("value").unwrap();
        
        assert_eq!(val, "some");
    }
}