use std::{
    marker::PhantomData,
    io::Error,
    fmt::{Display, Formatter},
    ops::{Deref, DerefMut}
};

use futures_util::future::{ok, Ready};

use hyper::{
    http::request::Parts,
    http::HeaderValue,
    HeaderMap
};

use crate::app::endpoints::args::{FromPayload, PayloadType, Payload, FromRequestRef};

pub use extract::*;
use crate::HttpRequest;

pub mod extract;

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

pub trait FromHeaders {
    fn from_headers(headers: &HeaderMap) -> &HeaderValue;
}

/// Wraps a `HeaderValue`
pub struct Header<T: FromHeaders> {
    value: HeaderValue,
    _marker: PhantomData<T>
}

impl<T: FromHeaders> Header<T> {
    pub fn new(header_value: &HeaderValue) -> Self {
        Self { value: header_value.clone(), _marker: PhantomData }
    }
    
    pub fn into_inner(self) -> HeaderValue {
        self.value
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
        let str = self.value.to_str().map_err(|_| std::fmt::Error)?;
        Display::fmt(str, f)
    }
}

impl FromPayload for Headers {
    type Future = Ready<Result<Self, Error>>;

    #[inline]
    fn from_payload(req: &Parts, _payload: Payload) -> Self::Future {
        let headers = req.headers.clone();
        ok(Headers { inner: headers })
    }

    #[inline]
    fn payload_type() -> PayloadType {
        PayloadType::Headers
    }
}

impl<T: FromHeaders + Send> FromRequestRef for Header<T> {
    fn from_request(req: &HttpRequest) -> Result<Self, Error> {
        let header_value = T::from_headers(req.headers());
        Ok(Header::new(header_value))
    }
}

impl<T: FromHeaders + Send> FromPayload for Header<T> {
    type Future = Ready<Result<Self, Error>>;

    #[inline]
    fn from_payload(req: &Parts, _payload: Payload) -> Self::Future {
        let header_value = T::from_headers(&req.headers);
        ok(Header::new(header_value))
    }

    #[inline]
    fn payload_type() -> PayloadType {
        PayloadType::Headers
    }
}
