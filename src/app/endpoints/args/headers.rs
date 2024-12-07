//! Extractors for HTTP headers

use futures_util::future::{ok, ready, Ready};
use std::{
    marker::PhantomData,
    io::{Error, ErrorKind},
    fmt::{Display, Formatter},
    ops::{Deref, DerefMut}
};

pub use hyper::{HeaderMap, http::HeaderValue};

use crate::{
    app::endpoints::args::{FromPayload, Source, Payload, FromRequestRef},
    HttpRequest
};

pub use extract::*;
pub use macros::custom_headers;

pub mod extract;
mod macros;

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
    /// Reads a [`HeaderValue`] from [`HeaderMap`]
    fn from_headers(headers: &HeaderMap) -> Option<&HeaderValue>;
    
    /// Returns a header type as `&str`
    fn header_type() -> &'static str;
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
    value: HeaderValue,
    _marker: PhantomData<T>
}

impl<T: FromHeaders> Header<T> {
    /// Creates a new instance of [`Header<T>`] from [`HeaderValue`]
    pub fn new(header_value: &HeaderValue) -> Self {
        Self { value: header_value.clone(), _marker: PhantomData }
    }
    
    /// Unwraps the inner [`HeaderValue`]
    pub fn into_inner(self) -> HeaderValue {
        self.value
    }
    
    /// Parses specific [`Header<T>`] from ['HeaderMap']
    #[inline]
    pub(super) fn from_headers_map(headers: &HeaderMap) -> Result<Self, Error> {
        T::from_headers(headers)
            .ok_or_else(HeaderError::header_missing::<T>)
            .map(Self::new)
    }
}

impl<T: FromHeaders> Deref for Header<T> {
    type Target = HeaderValue;

    fn deref(&self) -> &HeaderValue {
        &self.value
    }
}

impl<T: FromHeaders> DerefMut for Header<T> {
    fn deref_mut(&mut self) -> &mut HeaderValue {
        &mut self.value
    }
}

impl<T: FromHeaders> Display for Header<T>  {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        self.value.to_str().map_err(|_| std::fmt::Error)?.fmt(f)
    }
}

/// Extracts `HeaderMap` from request into `Headers`
impl FromPayload for Headers {
    type Future = Ready<Result<Self, Error>>;

    #[inline]
    fn from_payload(payload: Payload) -> Self::Future {
        if let Payload::Headers(headers) = payload {
            ok(Headers { inner: headers.clone() })
        } else {
            unreachable!()
        }
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
        Self::from_headers_map(req.headers())
    }
}

/// Extracts `HeaderValue` from request parts into `Header<T>``
/// where T implements [`FromHeaders`] `struct`
impl<T: FromHeaders + Send> FromPayload for Header<T> {
    type Future = Ready<Result<Self, Error>>;

    #[inline]
    fn from_payload(payload: Payload) -> Self::Future {
        if let Payload::Headers(headers) = payload {
            ready(Self::from_headers_map(headers))
        } else {
            unreachable!()
        }
    }

    #[inline]
    fn source() -> Source {
        Source::Headers
    }
}

struct HeaderError;

impl HeaderError {
    #[inline]
    fn header_missing<T: FromHeaders>() -> Error {
        Error::new(ErrorKind::NotFound, format!("Header: `{}` not found", T::header_type()))
    }
}

#[cfg(test)]
mod tests {
    use std::ops::Deref;
    use hyper::HeaderMap;
    use hyper::http::HeaderValue;
    use crate::headers::{ContentType, Header};

    #[test]
    fn it_gets_header() {
        let mut headers = HeaderMap::new();
        headers.insert("Content-Type", HeaderValue::from_static("text/plain"));
        
        let header: Header<ContentType> = Header::from_headers_map(&headers).unwrap();
        
        assert_eq!(header.deref(), "text/plain");
    }

    #[test]
    fn it_gets_missing_header() {
        let headers = HeaderMap::new();

        let header = Header::<ContentType>::from_headers_map(&headers);

        assert!(header.is_err());
        assert_eq!(header.err().unwrap().to_string(), "Header: `content-type` not found");
    }
}
