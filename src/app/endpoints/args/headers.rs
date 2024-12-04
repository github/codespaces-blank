//! Extractors for HTTP headers

use futures_util::future::{ok, Ready};
use std::{
    marker::PhantomData,
    io::Error,
    fmt::{Display, Formatter},
    ops::{Deref, DerefMut}
};

use hyper::{
    http::request::Parts,
    http::HeaderValue,
    HeaderMap
};

use crate::{
    app::endpoints::args::{FromPayload, Source, Payload, FromRequestRef},
    HttpRequest
};

pub use extract::*;

pub mod extract;

/// Wraps the [`HeaderMap`] extracted from request
///
/// # Example
/// ```no_run
/// use volga::{HttpResult, ok};
/// use volga::headers::Headers;
///
/// async fn handle(headers: Headers) -> HttpResult {
///     let content_length = headers.get("content-length").unwrap().to_str().unwrap();
///     ok!("Content-Length: {content_length}")
/// }
/// ```
#[derive(Debug)]
pub struct Headers {
    inner: HeaderMap<HeaderValue>
}

impl Deref for Headers {
    type Target = HeaderMap<HeaderValue>;

    fn deref(&self) -> &HeaderMap<HeaderValue> {
        &self.inner
    }
}

impl DerefMut for Headers {
    fn deref_mut(&mut self) -> &mut HeaderMap<HeaderValue> {
        &mut self.inner
    }
}

impl Headers {
    pub fn into_inner(self) -> HeaderMap<HeaderValue> {
        self.inner
    }
}

/// Describes a way to extract a specific HTTP header
pub trait FromHeaders {
    fn from_headers(headers: &HeaderMap) -> Option<&HeaderValue>;
}

/// Typed header that wraps a [`HeaderValue`]
///
/// # Example
/// ```no_run
/// use volga::{HttpResult, ok};
/// use volga::headers::{Header, ContentType};
///
/// async fn handle(content_type: Header<ContentType>) -> HttpResult {
///     ok!("Content-Type: {content_type}")
/// }
/// ```
#[derive(Debug)]
pub struct Header<T: FromHeaders> {
    value: Option<HeaderValue>,
    _marker: PhantomData<T>
}

impl<T: FromHeaders> Header<T> {
    /// Creates a new instance of [`Header<T>`] from [`HeaderValue`]
    pub fn new(header_value: &HeaderValue) -> Self {
        Self { value: Some(header_value.clone()), _marker: PhantomData }
    }

    /// Creates a new instance of [`Header<T>`] with empty [`HeaderValue`]
    pub fn empty() -> Self {
        Self { value: None, _marker: PhantomData }
    }
    
    /// Unwraps the inner [`HeaderValue`]
    pub fn into_inner(self) -> Option<HeaderValue> {
        self.value
    }

    /// Converts [`Header<T>`] to `&str`
    #[inline]
    pub fn to_str(&self) -> &str {
        self.value
            .as_ref()
            .and_then(|value| value.to_str().ok())
            .unwrap_or("")
    }
    
    /// Parses specific [`Header<T>`] from ['HeaderMap']
    #[inline]
    pub(super) fn from_headers_map(headers: &HeaderMap) -> Self {
        T::from_headers(headers)
            .map(Self::new)
            .unwrap_or_else(Self::empty)
    }
}

impl<T: FromHeaders> Deref for Header<T> {
    type Target = Option<HeaderValue>;

    fn deref(&self) -> &Option<HeaderValue> {
        &self.value
    }
}

impl<T: FromHeaders> DerefMut for Header<T> {
    fn deref_mut(&mut self) -> &mut Option<HeaderValue> {
        &mut self.value
    }
}

impl<T: FromHeaders> Display for Header<T>  {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match &self.value {
            Some(val) => val.to_str().map_err(|_| std::fmt::Error)?.fmt(f),
            None => f.write_str(""),
        }
    }
}

/// Extracts `HeaderMap` from request into `Headers`
impl FromPayload for Headers {
    type Future = Ready<Result<Self, Error>>;

    #[inline]
    fn from_payload(req: &Parts, _: Payload) -> Self::Future {
        let headers = req.headers.clone();
        ok(Headers { inner: headers })
    }

    #[inline]
    fn source() -> Source {
        Source::Headers
    }
}

/// Extracts `HeaderValue` from request into `Header<T>``
/// where T implements [`FromHeaders`] `struct`
impl<T: FromHeaders + Send> FromRequestRef for Header<T> {
    fn from_request(req: &HttpRequest) -> Result<Self, Error> {
        Ok(Self::from_headers_map(req.headers()))
    }
}

/// Extracts `HeaderValue` from request parts into `Header<T>``
/// where T implements [`FromHeaders`] `struct`
impl<T: FromHeaders + Send> FromPayload for Header<T> {
    type Future = Ready<Result<Self, Error>>;

    #[inline]
    fn from_payload(req: &Parts, _payload: Payload) -> Self::Future {
        ok(Self::from_headers_map(&req.headers))
    }

    #[inline]
    fn source() -> Source {
        Source::Headers
    }
}

#[cfg(test)]
mod tests {
    use hyper::HeaderMap;
    use hyper::http::HeaderValue;
    use crate::headers::{ContentType, Header};

    #[test]
    fn it_gets_header() {
        let mut headers = HeaderMap::new();
        headers.insert("Content-Type", HeaderValue::from_static("text/plain"));
        
        let header: Header<ContentType> = Header::from_headers_map(&headers);
        
        assert_eq!(header.to_str(), "text/plain");
    }

    #[test]
    fn it_gets_missing_header() {
        let headers = HeaderMap::new();

        let header: Header<ContentType> = Header::from_headers_map(&headers);

        assert!(header.value.is_none());
    }
}
