//! Tools for HTTP headers

use std::io::{Error, ErrorKind};

// Re-exporting HeaderMap, HeaderValue and some headers from hyper
pub use hyper::{
    header::{
        InvalidHeaderValue,
        ToStrError,
        ACCEPT_ENCODING,
        ACCEPT_RANGES,
        CONTENT_DISPOSITION,
        CONTENT_ENCODING,
        CONTENT_LENGTH,
        CONTENT_RANGE,
        CONTENT_TYPE,
        LOCATION,
        SERVER,
        TRANSFER_ENCODING,
        VARY
    },
    http::HeaderValue,
    HeaderMap
};

pub use self::{
    encoding::Encoding,
    extract::*,
    header::{Header, Headers},
    quality::Quality,
    macros::custom_headers
};

pub mod extract;
pub mod encoding;
pub mod header;
pub mod macros;
pub mod quality;

/// Describes a way to extract a specific HTTP header
pub trait FromHeaders {
    /// Reads a [`HeaderValue`] from [`HeaderMap`]
    fn from_headers(headers: &HeaderMap) -> Option<&HeaderValue>;

    /// Returns a header type as `&str`
    fn header_type() -> &'static str;
}

struct HeaderError;
impl HeaderError {
    #[inline]
    fn header_missing<T: FromHeaders>() -> Error {
        Error::new(ErrorKind::NotFound, format!("Header: `{}` not found", T::header_type()))
    }

    #[inline]
    fn from_invalid_header_value(error: InvalidHeaderValue) -> Error {
        Error::new(ErrorKind::InvalidData, format!("Header: {}", error))
    }

    #[inline]
    fn from_to_str_error(error: ToStrError) -> Error {
        Error::new(ErrorKind::InvalidData, format!("Header: {}", error))
    }
}
