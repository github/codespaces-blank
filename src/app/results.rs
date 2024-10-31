use std::collections::HashMap;
use bytes::Bytes;
use chrono::Utc;
use mime::Mime;
use serde::Serialize;
use http::{HeaderName, HeaderValue, Response, StatusCode};
use http::response::Builder;
use tokio::io;

pub mod macros;

/// A customized response context with custom response `headers` and `content_type`
/// 
/// # Example
/// ```no_run
///use volga::{App, AsyncEndpointsMapping, Results, ResponseContext};
///use std::collections::HashMap;
///
///#[tokio::main]
///async fn main() -> std::io::Result<()> {
///    let mut app = App::build("127.0.0.1:7878").await?;
///
///    app.map_get("/test", |req| async move {
///        let mut headers = HashMap::new();
///        headers.insert(String::from("x-api-key"), String::from("some api key"));
///        
///        Results::from(ResponseContext {
///            content: Box::new(String::from("Hello World!")),
///            headers: Some(headers),
///            content_type: Some(mime::TEXT_PLAIN)
///        })
///    });
///
///    app.run().await
///}
/// ```
pub struct ResponseContext<T: ?Sized> {
    pub content: Box<T>,
    pub headers: Option<HashMap<String, String>>,
    pub content_type: Option<Mime>
}

pub type HttpResponse = Response<Bytes>; 
pub type HttpResult = io::Result<HttpResponse>;

pub struct Results;

impl Results {
    /// Produces a customized `OK 200` response
    pub fn from<T>(context: ResponseContext<T>) -> HttpResult
    where T:
        ?Sized + Serialize
    {
        let ResponseContext { content, headers, content_type } = context;
        let mut builder = Self::create_default_builder();

        if let Some(headers_ref) = builder.headers_mut() {
            if let Some(headers_map) = headers {
                for (name, value) in headers_map {
                    let header_name = HeaderName::from_bytes(name.as_bytes());
                    let header_value = HeaderValue::from_bytes(value.as_bytes());
                    
                    match (header_name, header_value) {
                        (Ok(header_name), Ok(header_value)) => headers_ref.insert(header_name, header_value),
                        _ => None
                    };
                }
            }

            if let Some(content_type) = content_type {
                headers_ref.insert(http::header::CONTENT_TYPE, HeaderValue::from_bytes(content_type.as_ref().as_bytes()).unwrap());
            } else {
                headers_ref.insert(http::header::CONTENT_TYPE, HeaderValue::from_bytes(mime::TEXT_PLAIN.as_ref().as_bytes()).unwrap());
            }
        } else {
            // log this issue
        }

        let content = serde_json::to_vec(&content)?;

        builder
            .status(StatusCode::OK)
            .header(http::header::CONTENT_LENGTH, content.len())
            .body(Bytes::from(content))
            .map_err(|_| Self::response_error())
    }

    /// Produces an `OK 200` response with the `JSON` body.
    #[inline]
    pub fn json<T>(content: &T) -> HttpResult
    where T:
        ?Sized + Serialize
    {
        let content = serde_json::to_vec(content)?;
        let body = Bytes::from(content);
        Self::status(
            StatusCode::OK,
            mime::APPLICATION_JSON.as_ref(),
            body)
    }

    /// Produces a response with `StatusCode` the `JSON` body.
    #[inline]
    pub fn json_with_status<T>(status: StatusCode, content: &T) -> HttpResult
    where T:
        ?Sized + Serialize
    {
        let content = serde_json::to_vec(content)?;
        let body = Bytes::from(content);
        Self::status(
            status,
            mime::APPLICATION_JSON.as_ref(),
            body)
    }

    /// Produces an `OK 200` response with the plain text body.
    #[inline]
    pub fn text(content: &str) -> HttpResult {
        let body = Bytes::from(String::from(content));
        Self::status(
            StatusCode::OK,
            mime::TEXT_PLAIN.as_ref(),
            body)
    }

    /// Produces an `OK 200` response with the file body.
    #[inline]
    pub fn file(file_name: &str, content: Vec<u8>) -> HttpResult {
        let body = Bytes::from(content);
        let file_name = format!("attachment; filename=\"{}\"", file_name);
        Self::create_default_builder()
            .status(StatusCode::OK)
            .header(http::header::CONTENT_LENGTH, body.len())
            .header(http::header::CONTENT_TYPE, mime::APPLICATION_OCTET_STREAM.as_ref())
            .header(http::header::CONTENT_DISPOSITION, file_name)
            .body(body)
            .map_err(|_| Self::response_error())
    }

    /// Produces an empty `OK 200` response.
    #[inline]
    pub fn ok() -> HttpResult {
        Self::status(
            StatusCode::OK,
            mime::TEXT_PLAIN.as_ref(),
            Bytes::new())
    }

    /// Produces an `NOT FOUND 400` response.
    #[inline]
    pub fn not_found() -> HttpResult {
        Self::status(
            StatusCode::NOT_FOUND,
            mime::TEXT_PLAIN.as_ref(),
            Bytes::new())
    }

    /// Produces an `INTERNAL SERVER ERROR 500` response.
    #[inline]
    pub fn internal_server_error(error: Option<String>) -> HttpResult {
        let body = Self::get_error_bytes(error);
        Self::status(
            StatusCode::INTERNAL_SERVER_ERROR,
            mime::TEXT_PLAIN.as_ref(),
            body)
    }

    /// Produces an `BAD REQUEST 400` response.
    #[inline]
    pub fn bad_request(error: Option<String>) -> HttpResult {
        let body = Self::get_error_bytes(error);
        Self::status(
            StatusCode::BAD_REQUEST,
            mime::TEXT_PLAIN.as_ref(),
            body)
    }

    /// Produces an `CLIENT CLOSED REQUEST 499` response.
    #[inline]
    pub fn client_closed_request() -> HttpResult {
        Self::status(
            StatusCode::from_u16(499).unwrap(),
            mime::TEXT_PLAIN.as_ref(),
            Bytes::new())
    }

    #[inline]
    pub fn status(status: StatusCode, mime: &str, content: Bytes) -> HttpResult {
        Self::create_default_builder()
            .status(status)
            .header(http::header::CONTENT_LENGTH, content.len())
            .header(http::header::CONTENT_TYPE, mime)
            .body(content)
            .map_err(|_| Self::response_error())
    }

    #[inline]
    fn create_default_builder() -> Builder {
        Response::builder()
            .header(http::header::DATE, Utc::now().to_rfc2822())
            .header(http::header::SERVER, "Volga")
    }
    
    #[inline]
    fn response_error() -> io::Error {
        io::Error::new(io::ErrorKind::Other, "Unable to create a response")
    }

    #[inline]
    fn get_error_bytes(error: Option<String>) -> Bytes {
        if let Some(error) = error {
            Bytes::from(error)
        } else {
            Bytes::new()
        }
    }
}