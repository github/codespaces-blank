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

/// Wraps the incoming [`Request`] to enrich its functionality
pub struct HttpRequest(pub Request<Incoming>);

impl Deref for HttpRequest {
    type Target = Request<Incoming>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl DerefMut for HttpRequest {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

impl HttpRequest {
    /// Unwraps the inner request
    #[inline]
    pub fn into_inner(self) -> Request<Incoming> {
        self.0
    }

    /// Consumes the request and returns just the body
    #[inline]
    pub fn into_body(self) -> Incoming {
        self.0.into_body()
    }

    /// Consumes the request and returns the body as boxed trait object
    #[inline]
    pub fn into_boxed_body(self) -> BoxBody {
        self.0.into_body()
            .map_err(|e| Error::new(ErrorKind::InvalidInput, e))
            .boxed()
    }

    /// Consumes the request and returns request head and body
    pub fn into_parts(self) -> (Parts, Incoming) {
        self.0.into_parts()
    }
    
    /// Extracts a payload from request parts
    ///
    /// # Example
    /// ```no_run
    /// use volga::{HttpContext, HttpRequest, Query};
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
