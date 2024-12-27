use std::io::Error;

use crate::app::endpoints::{
    handlers::RouteHandler,
    args::FromRequestRef
};

use crate::{
    headers::{Header, FromHeaders},
    HttpRequest, 
    HttpResult
};

#[cfg(feature = "di")]
use crate::app::di::Inject;

/// Describes current HTTP context which consists of the current HTTP request data 
/// and the reference to the method handler fot this request
pub struct HttpContext {
    /// Current HTTP request
    pub request: HttpRequest,
    
    /// Current handler that mapped to handle the HTTP request
    handler: RouteHandler
}

impl HttpContext {
    /// Creates a new [`HttpContext`]
    pub(super) fn new(request: HttpRequest, handler: RouteHandler) -> Self {
        Self { request, handler }
    }
    
    /// Extracts a payload from request parts
    ///
    /// # Example
    /// ```no_run
    /// use volga::{middleware::HttpContext, Query};
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
    #[inline]
    pub fn extract<T: FromRequestRef>(&self) -> Result<T, Error> {
        self.request.extract()
    }

    /// Resolves a service from Dependency Container
    #[cfg(feature = "di")]
    pub fn resolve<T: Inject + 'static>(&mut self) -> Result<T, Error> {
        self.request.resolve::<T>()
    }
    
    /// Inserts the [`Header<T>`] to HTTP request headers
    #[inline]
    pub fn insert_header<T: FromHeaders>(&mut self, header: Header<T>) {
        self.request.insert_header(header)
    }

    /// Executes the request handler for current HTTP request
    pub(super) async fn execute(self) -> HttpResult {
        self.handler.call(self.request).await
    }
}
