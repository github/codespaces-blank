use crate::{
    app::body::{BoxBody, HttpBody},
    RESPONSE_ERROR,
    response,
    builder
};

use std::collections::HashMap;
use tokio::{io, fs::File};
use serde::Serialize;

use hyper::{header::{HeaderName, HeaderValue}, http::response::Builder, Response, StatusCode};
use hyper::header::{ 
    CONTENT_DISPOSITION,
    TRANSFER_ENCODING,
    CONTENT_TYPE
};

use mime::{
    APPLICATION_OCTET_STREAM,
    APPLICATION_JSON,
    TEXT_PLAIN
};

pub mod builder;
pub mod macros;

/// A customized response context with custom response `headers` and `content_type`
/// > NOTE: This is not suitable for file response use the `file!` or `Results::file()` instead
/// # Example
/// ```no_run
/// use volga::{Results, ResponseContext};
/// use std::collections::HashMap;
///
/// let mut headers = HashMap::new();
/// headers.insert(String::from("x-api-key"), String::from("some api key"));
///
/// Results::from(ResponseContext {
///     content: "Hello World!",
///     status: 200,
///     headers
/// });
/// ```
/// or alternative way by using `From` trait
/// ```no_run
/// use volga::{ResponseContext, HttpResult};
/// use std::collections::HashMap;
///
/// let mut headers = HashMap::new();
/// headers.insert(String::from("x-api-key"), String::from("some api key"));
///
/// HttpResult::from(ResponseContext {
///     content: "Hello World!",
///     status: 200,
///     headers
/// });
/// ```
pub struct ResponseContext<T: Serialize> {
    pub content: T,
    pub status: u16,
    pub headers: HttpHeaders
}

pub type HttpResponse = Response<BoxBody>;
pub type HttpResult = io::Result<HttpResponse>;
pub type HttpHeaders = HashMap<String, String>;

pub struct Results;

impl Results {
    /// Produces a customized `OK 200` response
    #[inline]
    pub fn from<T: Serialize>(context: ResponseContext<T>) -> HttpResult {
        HttpResult::from(context)
    }

    /// Produces an `OK 200` response with the `JSON` body.
    #[inline]
    pub fn json<T>(content: T) -> HttpResult
    where 
        T: Serialize
    {
        Self::json_with_status(StatusCode::OK, content)
    }

    /// Produces a response with `StatusCode` the `JSON` body.
    #[inline]
    pub fn json_with_status<T>(status: StatusCode, content: T) -> HttpResult
    where 
        T: Serialize
    {
        response!(
            status,
            HttpBody::json(content),
            [
                (CONTENT_TYPE, APPLICATION_JSON.as_ref())
            ]
        )
    }

    /// Produces an `OK 200` response with the plain text body.
    #[inline]
    pub fn text(content: &str) -> HttpResult {
        response!(
            StatusCode::OK, 
            HttpBody::full(content.to_string()),
            [
                (CONTENT_TYPE, TEXT_PLAIN.as_ref())
            ]
        )
    }

    /// Produces an `OK 200` response with the stream body.
    #[inline]
    pub fn stream(content: BoxBody) -> HttpResult {
        response!(StatusCode::OK, content)
    }

    /// Produces an `OK 200` response with the file body.
    #[inline]
    pub fn file(file_name: &str, content: File) -> HttpResult {
        let boxed_body = HttpBody::wrap_stream(content);
        let file_name = format!("attachment; filename=\"{}\"", file_name);
        response!(
            StatusCode::OK, 
            boxed_body,
            [
                (CONTENT_TYPE, APPLICATION_OCTET_STREAM.as_ref()),
                (TRANSFER_ENCODING, "chunked"),
                (CONTENT_DISPOSITION, file_name)
            ]
        )
    }

    /// Produces an empty `OK 200` response.
    #[inline]
    pub fn ok() -> HttpResult {
        response!(
            StatusCode::OK, 
            HttpBody::empty(),
            [
                (CONTENT_TYPE, TEXT_PLAIN.as_ref())
            ]
        )
    }

    /// Produces an `CLIENT CLOSED REQUEST 499` response.
    #[inline]
    pub fn client_closed_request() -> HttpResult {
        response!(
            StatusCode::from_u16(499).unwrap(),
            HttpBody::empty(),
            [(CONTENT_TYPE, TEXT_PLAIN.as_ref())])
    }

    #[inline]
    fn create_custom_builder(status: StatusCode, headers: HttpHeaders) -> Builder {
        let mut builder = builder!(status);
        if let Some(headers_ref) = builder.headers_mut() {
            for (name, value) in &headers {
                if let (Ok(header_name), Ok(header_value)) = (
                    HeaderName::from_bytes(name.as_bytes()),
                    HeaderValue::from_bytes(value.as_bytes()),
                ) {
                    headers_ref.insert(header_name, header_value);
                }
            }
            // if the content type is not provided - using the application/json by default
            if headers_ref.get(&CONTENT_TYPE).is_none() {
                headers_ref.insert(
                    CONTENT_TYPE, 
                    HeaderValue::from_static(APPLICATION_JSON.as_ref())
                );
            }
        } else if cfg!(debug_assertions) {
            eprintln!("Failed to write to HTTP headers");
        }
        builder
    }
}

impl<T: Serialize> From<ResponseContext<T>> for HttpResult {
    #[inline]
    fn from(value: ResponseContext<T>) -> Self {
        let ResponseContext { content, headers, status } = value;
        let content = serde_json::to_vec(&content)?;
        let status = StatusCode::from_u16(status).unwrap_or(StatusCode::OK);

        Results::create_custom_builder(status, headers)
            .body(HttpBody::full(content))
            .map_err(|_| io::Error::new(io::ErrorKind::Other, RESPONSE_ERROR))
    }
}

#[cfg(test)]
mod tests {
    use std::collections::HashMap;
    use std::path::Path;
    use hyper::StatusCode;
    use http_body_util::BodyExt;
    use serde::Serialize;
    use tokio::fs::File;
    use crate::{response, HttpResult, ResponseContext, Results};
    use crate::app::body::HttpBody;
    use crate::test_utils::read_file_bytes;

    #[derive(Serialize)]
    struct TestPayload {
        name: String
    }
    
    #[tokio::test]
    async fn in_creates_text_response_with_custom_headers() {
        let mut headers = HashMap::new();
        headers.insert(String::from("x-api-key"), String::from("some api key"));
        
        let mut response = HttpResult::from(ResponseContext {
            status: 400,
            content: String::from("Hello World!"),
            headers
        }).unwrap();

        let body = &response.body_mut().collect().await.unwrap().to_bytes();
        
        assert_eq!(response.status(), StatusCode::BAD_REQUEST);
        assert_eq!(String::from_utf8_lossy(body), "\"Hello World!\"");
        assert_eq!(response.headers().get("Content-Type").unwrap(), "application/json");
        assert_eq!(response.headers().get("x-api-key").unwrap(), "some api key");
    }

    #[tokio::test]
    async fn in_creates_str_text_response_with_custom_headers() {
        let mut headers = HashMap::new();
        headers.insert(String::from("x-api-key"), String::from("some api key"));
        headers.insert(String::from("Content-Type"), String::from("text/plain"));

        let mut response = HttpResult::from(ResponseContext {
            status: 200,
            content: "Hello World!",
            headers,
        }).unwrap();

        let body = &response.body_mut().collect().await.unwrap().to_bytes();

        assert_eq!(response.status(), StatusCode::OK);
        assert_eq!(String::from_utf8_lossy(body), "\"Hello World!\"");
        assert_eq!(response.headers().get("Content-Type").unwrap(), "text/plain");
        assert_eq!(response.headers().get("x-api-key").unwrap(), "some api key");
    }

    #[tokio::test]
    async fn in_creates_json_response_with_custom_headers() {
        let mut headers = HashMap::new();
        headers.insert(String::from("x-api-key"), String::from("some api key"));
        headers.insert(String::from("Content-Type"), String::from("application/json"));

        let content = TestPayload { name: "test".into() };
        
        let mut response = HttpResult::from(ResponseContext {
            status: 200,
            content,
            headers,
        }).unwrap();

        let body = &response.body_mut().collect().await.unwrap().to_bytes();

        assert_eq!(response.status(), StatusCode::OK);
        assert_eq!(String::from_utf8_lossy(body), "{\"name\":\"test\"}");
        assert_eq!(response.headers().get("Content-Type").unwrap(), "application/json");
        assert_eq!(response.headers().get("x-api-key").unwrap(), "some api key");
    }

    #[tokio::test]
    async fn it_creates_json_response() {
        let payload = TestPayload { name: "test".into() };
        let mut response = Results::json(payload).unwrap();

        let body = &response.body_mut().collect().await.unwrap().to_bytes();
        
        assert_eq!(response.status(), StatusCode::OK);
        assert_eq!(String::from_utf8_lossy(body), "{\"name\":\"test\"}");
        assert_eq!(response.headers().get("Content-Type").unwrap(), "application/json");
    }

    #[tokio::test]
    async fn it_creates_json_response_with_custom_status() {
        let payload = TestPayload { name: "test".into() };
        let mut response = Results::json_with_status(StatusCode::NOT_FOUND, payload).unwrap();

        let body = &response.body_mut().collect().await.unwrap().to_bytes();
        
        assert_eq!(response.status(), StatusCode::NOT_FOUND);
        assert_eq!(String::from_utf8_lossy(body), "{\"name\":\"test\"}");
        assert_eq!(response.headers().get("Content-Type").unwrap(), "application/json");
    }

    #[tokio::test]
    async fn it_creates_text_response() {
        let mut response = Results::text("Hello World!").unwrap();

        let body = &response.body_mut().collect().await.unwrap().to_bytes();
        
        assert_eq!(response.status(), StatusCode::OK);
        assert_eq!(String::from_utf8_lossy(body), "Hello World!");
        assert_eq!(response.headers().get("Content-Type").unwrap(), "text/plain");
    }

    #[tokio::test]
    async fn it_creates_stream_response() {
        let path = Path::new("tests/resources/test_file.txt");
        let file = File::open(path).await.unwrap();
        let body = HttpBody::wrap_stream(file);
        
        let mut response = Results::stream(body).unwrap();

        let body = read_file_bytes(&mut response).await;

        assert_eq!(response.status(), StatusCode::OK);
        assert_eq!(String::from_utf8_lossy(body.as_slice()), "Hello, this is some file content!");
    }

    #[tokio::test]
    async fn it_creates_file_response() {
        let path = Path::new("tests/resources/test_file.txt");
        let file_name = path.file_name().and_then(|name| name.to_str()).unwrap();
        
        let file = File::open(path).await.unwrap();
        let mut response = Results::file(file_name, file).unwrap();

        let body = read_file_bytes(&mut response).await;
        
        assert_eq!(response.status(), StatusCode::OK);
        assert_eq!(String::from_utf8_lossy(body.as_slice()), "Hello, this is some file content!");
    }

    #[tokio::test]
    async fn it_creates_file_response_with_custom_headers() {
        let path = Path::new("tests/resources/test_file.txt");
        let file = File::open(path).await.unwrap();
        let mut response = response!(
            StatusCode::OK,
            HttpBody::wrap_stream(file),
            [
                ("x-api-key", "some api key"),
                ("Content-Type", "application/octet-stream")
            ]
        ).unwrap();
        
        let body = read_file_bytes(&mut response).await;
        
        assert_eq!(response.status(), StatusCode::OK);
        assert_eq!(String::from_utf8_lossy(body.as_slice()), "Hello, this is some file content!");
        assert_eq!(response.headers().get("Content-Type").unwrap(), "application/octet-stream");
        assert_eq!(response.headers().get("x-api-key").unwrap(), "some api key");
    }
    
    #[tokio::test]
    async fn it_creates_empty_ok_response() {
        let mut response = Results::ok().unwrap();

        let body = &response.body_mut().collect().await.unwrap().to_bytes();
        
        assert_eq!(response.status(), StatusCode::OK);
        assert_eq!(body.len(), 0);
        assert_eq!(response.headers().get("Content-Type").unwrap(), "text/plain");
    }

    #[tokio::test]
    async fn it_creates_empty_not_found_response() {
        let mut response = response!(
            StatusCode::NOT_FOUND, 
            HttpBody::empty(),
            [
                ("Content-Type", "text/plain")
            ]
        ).unwrap();

        let body = &response.body_mut().collect().await.unwrap().to_bytes();
        
        assert_eq!(response.status(), StatusCode::NOT_FOUND);
        assert_eq!(body.len(), 0);
        assert_eq!(response.headers().get("Content-Type").unwrap(), "text/plain");
    }

    #[tokio::test]
    async fn it_creates_client_closed_request_response() {
        let mut response = Results::client_closed_request().unwrap();

        let body = &response.body_mut().collect().await.unwrap().to_bytes();
        
        assert_eq!(response.status().as_u16(), 499);
        assert_eq!(body.len(), 0);
        assert_eq!(response.headers().get("Content-Type").unwrap(), "text/plain");
    }

    #[tokio::test]
    async fn it_creates_empty_custom_response() {
        let mut response = response!(
            StatusCode::UNAUTHORIZED,
            HttpBody::empty(),
            [
                ("Content-Type", "application/pdf")
            ]
        ).unwrap();

        let body = &response.body_mut().collect().await.unwrap().to_bytes();
        
        assert_eq!(response.status(), StatusCode::UNAUTHORIZED);
        assert_eq!(body.len(), 0);
        assert_eq!(response.headers().get("Content-Type").unwrap(), "application/pdf");
    }

    #[tokio::test]
    async fn it_creates_custom_response() {
        let mut response = response!(
            StatusCode::FORBIDDEN,
            HttpBody::full("Hello World!"),
            [
                ("Content-Type", "text/plain")
            ]
        ).unwrap();

        let body = &response.body_mut().collect().await.unwrap().to_bytes();
        
        assert_eq!(response.status(), StatusCode::FORBIDDEN);
        assert_eq!(String::from_utf8_lossy(body), "Hello World!");
        assert_eq!(response.headers().get("Content-Type").unwrap(), "text/plain");
    }
}