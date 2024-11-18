use crate::app::endpoints::handlers::RouteHandler;
use crate::{
    HttpRequest, 
    HttpResult
};

pub struct HttpContext {
    pub request: HttpRequest,
    handler: RouteHandler
}

impl HttpContext {
    pub(crate) fn new(request: HttpRequest, handler: RouteHandler) -> Self {
        Self { request, handler }
    }

    pub(crate) async fn execute(self) -> HttpResult {
        self.handler.call(self.request).await
    }
}