use std::collections::HashMap;
use bytes::Bytes;
use chrono::Utc;
use mime::Mime;
use serde::Serialize;
use http::{HeaderName, HeaderValue, Response, StatusCode};
use http::response::Builder;
use tokio::io;

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
///    }).await;
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
        Self::create_default_builder()
            .status(StatusCode::OK)
            .header(http::header::CONTENT_LENGTH, content.len())
            .header(http::header::CONTENT_TYPE, mime::APPLICATION_JSON.as_ref())
            .body(Bytes::from(content))
            .map_err(|_| Self::response_error())
    }

    /// Produces an `OK 200` response with the plain text body.
    #[inline]
    pub fn text(content: &str) -> HttpResult {
        Self::create_default_builder()
            .status(StatusCode::OK)
            .header(http::header::CONTENT_LENGTH, content.len())
            .header(http::header::CONTENT_TYPE, mime::TEXT_PLAIN.as_ref())
            .body(Bytes::from(String::from(content)))
            .map_err(|_| Self::response_error())
    }

    /// Produces an `NOT FOUND 400` response.
    #[inline]
    pub fn not_found() -> HttpResult {
        Self::create_default_builder()
            .status(StatusCode::NOT_FOUND)
            .header(http::header::CONTENT_LENGTH, 0)
            .header(http::header::CONTENT_TYPE, mime::TEXT_PLAIN.as_ref())
            .body(Bytes::new())
            .map_err(|_| Self::response_error())
    }

    /// Produces an `INTERNAL SERVER ERROR 500` response.
    #[inline]
    pub fn internal_server_error(error: Option<String>) -> HttpResult {
        let (len, body) = Self::get_error_info(error);
        Self::create_default_builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header(http::header::CONTENT_LENGTH, len)
            .header(http::header::CONTENT_TYPE, mime::TEXT_PLAIN.as_ref())
            .body(body)
            .map_err(|_| Self::response_error())
    }

    /// Produces an `BAD REQUEST 400` response.
    #[inline]
    pub fn bad_request(error: Option<String>) -> HttpResult {
        let (len, body) = Self::get_error_info(error);
        Self::create_default_builder()
            .status(StatusCode::BAD_REQUEST)
            .header(http::header::CONTENT_LENGTH, len)
            .header(http::header::CONTENT_TYPE, mime::TEXT_PLAIN.as_ref())
            .body(body)
            .map_err(|_| Self::response_error())
    }

    /// Produces an `CLIENT CLOSED REQUEST 499` response.
    #[inline]
    pub fn client_closed_request() -> HttpResult {
        Self::create_default_builder()
            .status(499)
            .header(http::header::CONTENT_LENGTH, 0)
            .header(http::header::CONTENT_TYPE, mime::TEXT_PLAIN.as_ref())
            .body(Bytes::new())
            .map_err(|_| Self::response_error())
    }

    #[inline]
    fn create_default_builder() -> Builder {
        Response::builder()
            .header(http::header::DATE,Utc::now().to_rfc2822())
            .header(http::header::SERVER, "Volga")
    }
    
    #[inline]
    fn response_error() -> io::Error {
        io::Error::new(io::ErrorKind::Other, "Unable to create a response")
    }

    #[inline]
    fn get_error_info(error: Option<String>) -> (usize, Bytes) {
        if let Some(error) = error {
            (error.len(), Bytes::from(error))
        } else {
            (0, Bytes::new())
        }
    }
}