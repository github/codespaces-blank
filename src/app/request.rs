use http_body_util::BodyExt;

use hyper::{
    Request, 
    http::request::Parts,
    body::Incoming
};

use std::{
    ops::{Deref, DerefMut},
    io::Error
};
use std::io::ErrorKind;
use crate::{app::endpoints::args::FromRequestRef, headers::{FromHeaders, Header}, BoxBody};

#[cfg(feature = "di")]
use crate::app::di::Container;

/// Wraps the incoming [`Request`] to enrich its functionality
pub struct HttpRequest {
    pub inner: Request<Incoming>,
    #[cfg(feature = "di")]
    pub(crate) container: Container
}

impl Deref for HttpRequest {
    type Target = Request<Incoming>;

    fn deref(&self) -> &Self::Target {
        &self.inner
    }
}

impl DerefMut for HttpRequest {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.inner
    }
}

impl HttpRequest {
    #[cfg(not(feature = "di"))]
    pub fn new(request: Request<Incoming>) -> Self {
        Self { inner: request }
    }

    #[cfg(feature = "di")]
    pub fn new(request: Request<Incoming>, container: Container) -> Self {
        Self { inner: request, container }
    }
    
    /// Unwraps the inner request
    #[inline]
    pub fn into_inner(self) -> Request<Incoming> {
        self.inner
    }

    /// Consumes the request and returns just the body
    #[inline]
    pub fn into_body(self) -> Incoming {
        self.inner.into_body()
    }

    /// Consumes the request and returns the body as boxed trait object
    #[inline]
    pub fn into_boxed_body(self) -> BoxBody {
        self.inner.into_body()
            .map_err(|e| Error::new(ErrorKind::InvalidInput, e))
            .boxed()
    }

    /// Consumes the request and returns request head and body
    #[cfg(not(feature = "di"))]
    pub fn into_parts(self) -> (Parts, Incoming) {
        self.inner.into_parts()
    }

    /// Creates a new `HttpRequest` with the given head and body
    #[cfg(not(feature = "di"))]
    pub fn from_parts(parts: Parts, body: Incoming) -> Self {
        let request = Request::from_parts(parts, body);
        Self::new(request)
    }

    /// Consumes the request and returns request head, body and scoped DI container
    #[cfg(feature = "di")]
    pub fn into_parts(self) -> (Parts, Incoming, Container) {
        let (parts, body) = self.inner.into_parts();
        (parts, body, self.container)
    }
    
    /// Creates a new `HttpRequest` with the given head, body and scoped DI container
    #[cfg(feature = "di")]
    pub fn from_parts(parts: Parts, body: Incoming, container: Container) -> Self {
        let request = Request::from_parts(parts, body);
        Self::new(request, container)
    }
    
    /// Extracts a payload from request parts
    ///
    /// # Example
    /// ```no_run
    /// use volga::{HttpRequest, Query};
    /// use serde::Deserialize;
    ///
    /// #[derive(Deserialize)]
    /// struct Params {
    ///     id: u32,
    ///     key: String
    /// }
    ///
    /// # fn docs(req: HttpRequest) -> std::io::Result<()> {
    /// let params: Query<Params> = req.extract()?;
    /// # Ok(())
    /// # }
    /// ```
    #[inline]
    pub fn extract<T: FromRequestRef>(&self) -> Result<T, Error> {
        T::from_request(self)
    }

    /// Inserts the [`Header<T>`] to HTTP request headers
    #[inline]
    pub fn insert_header<T: FromHeaders>(&mut self, header: Header<T>) {
        let (name, value) = header.into_parts();
        self.headers_mut().insert(name, value);
    }
}
