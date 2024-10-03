use std::collections::HashMap;
use bytes::Bytes;
use chrono::Utc;
use http::{HeaderName, HeaderValue, Response, StatusCode};
use http::response::Builder;
use mime::Mime;
use serde::Serialize;

pub struct ResponseContext<T: ?Sized> {
    pub content: Box<T>,
    pub headers: Option<HashMap<String, String>>,
    pub content_type: Option<Mime>
}

pub struct Results;

impl Results {
    pub fn from<T>(context: ResponseContext<T>) -> http::Result<Response<Bytes>>
    where T:
        ?Sized + Serialize
    {
        let ResponseContext { content, headers, content_type } = context;
        let mut builder = Self::create_default_builder();

        if let Some(headers_ref) = builder.headers_mut() {
            if let Some(headers_map) = headers {
                for (name, value) in headers_map {
                    headers_ref.insert(HeaderName::from_bytes(name.as_bytes())?, HeaderValue::from_bytes(value.as_bytes())?);
                }
            }

            if let Some(content_type) = content_type {
                headers_ref.insert(http::header::CONTENT_TYPE, HeaderValue::from_bytes(content_type.as_ref().as_bytes())?);
            } else {
                headers_ref.insert(http::header::CONTENT_TYPE, HeaderValue::from_bytes(mime::TEXT_PLAIN.as_ref().as_bytes())?);
            }
        } else {
            // log this issue
        }

        let content = serde_json::to_string(&content).unwrap();

        builder
            .status(StatusCode::OK)
            .header(http::header::CONTENT_LENGTH, content.len())
            .body(Bytes::from(content))
    }

    #[inline]
    pub fn json<T>(content: &T) -> http::Result<Response<Bytes>>
    where T:
        ?Sized + Serialize
    {
        if let Ok(content) = serde_json::to_string(content) {
            let builder = Self::create_default_builder();

            builder
                .status(StatusCode::OK)
                .header(http::header::CONTENT_LENGTH, content.len())
                .header(http::header::CONTENT_TYPE, mime::APPLICATION_JSON.as_ref())
                .body(Bytes::from(String::from(content)))
        } else {
            Self::internal_server_error()
        }
    }

    #[inline]
    pub fn text(content: &str) -> http::Result<Response<Bytes>> {
        let builder = Self::create_default_builder();

        builder
            .status(StatusCode::OK)
            .header(http::header::CONTENT_LENGTH, content.len())
            .header(http::header::CONTENT_TYPE, mime::TEXT_PLAIN.as_ref())
            .body(Bytes::from(String::from(content)))
    }

    #[inline]
    pub fn not_found() -> http::Result<Response<Bytes>> {
        let builder = Self::create_default_builder();

        builder
            .status(StatusCode::NOT_FOUND)
            .header(http::header::CONTENT_LENGTH, 0)
            .header(http::header::CONTENT_TYPE, mime::TEXT_PLAIN.as_ref())
            .body(Bytes::new())
    }

    #[inline]
    pub fn internal_server_error() -> http::Result<Response<Bytes>> {
        let builder = Self::create_default_builder();

        builder
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header(http::header::CONTENT_LENGTH, 0)
            .header(http::header::CONTENT_TYPE, mime::TEXT_PLAIN.as_ref())
            .body(Bytes::new())
    }

    #[inline]
    fn create_default_builder() -> Builder {
        Response::builder()
            .header(http::header::DATE,Utc::now().to_rfc2822())
            .header(http::header::SERVER, "Volga")
    }
}