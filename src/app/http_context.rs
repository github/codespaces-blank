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
    
    /// Inserts the [`Header<T>`] to HTTP request headers
    #[inline]
    pub fn insert_header<T: FromHeaders>(&mut self, header: Header<T>) {
        let (name, value) = header.into_parts();
        self.request
            .headers_mut()
            .insert(name, value);
    }
    
    pub(super) fn new(request: HttpRequest, handler: RouteHandler) -> Self {
        Self { request, handler }
    }

    pub(super) async fn execute(self) -> HttpResult {
        self.handler.call(self.request).await
    }
}