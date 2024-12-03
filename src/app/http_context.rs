use std::io::Error;

use crate::app::endpoints::handlers::RouteHandler;
use crate::app::endpoints::args::FromRequestRef;

use crate::{
    HttpRequest, 
    HttpResult
};

/// Describes current HTTP context
pub struct HttpContext {
    pub request: HttpRequest,
    handler: RouteHandler
}

impl HttpContext {
    /// Extracts a payload from request parts
    ///
    /// # Example
    /// ```no_run
    /// use volga::{HttpContext, Query};
    /// use serde::Deserialize;
    ///
    /// #[derive(Deserialize)]
    /// struct Params {
    ///     id: u32,
    ///     key: String
    /// }
    /// 
    /// # fn docs(ctx: HttpContext) -> std::io::Result<()> {
    /// let params: Query<Params> = ctx.extract()?;
    /// # Ok(())
    /// # }
    /// ```
    pub fn extract<T: FromRequestRef>(&self) -> Result<T, Error> {
        T::from_request(&self.request)
    }
    
    pub(super) fn new(request: HttpRequest, handler: RouteHandler) -> Self {
        Self { request, handler }
    }

    pub(super) async fn execute(self) -> HttpResult {
        self.handler.call(self.request).await
    }
}