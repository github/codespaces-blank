use std::collections::HashMap;
use std::io;
use std::sync::Arc;
use bytes::Bytes;
use http::{Request, Version};
use http::header::{HeaderName, HeaderValue};
use httparse::{Header, Request as HttParseRequest};
use serde::Deserialize;

pub(crate) struct RawRequest<'headers, 'buf> {
    raw_request: HttParseRequest<'headers, 'buf>,
    body: Bytes
}

impl RawRequest<'_, '_> {
    #[inline]
    pub(crate) fn parse_request<'a>(buffer: &'a [u8], headers: &'a mut [Header<'a>]) -> Result<RawRequest<'a, 'a>, io::Error> {
        let mut req = HttParseRequest::new(headers);

        match req.parse(buffer) {
            Ok(httparse::Status::Complete(headers_size)) => { // Parsing complete
                // Body extraction from the buffer
                // Note that this just takes the rest of the buffer; adjust according to the actual headers/content-length
                let body = Bytes::copy_from_slice(&buffer[headers_size..]);
                Ok(RawRequest { raw_request: req, body })
            },
            Ok(httparse::Status::Partial) => Err(io::Error::new(io::ErrorKind::UnexpectedEof, "Request is incomplete")),
            Err(e) => Err(io::Error::new(io::ErrorKind::InvalidData, format!("Failed to parse request: {}", e)))
        }
    }

    #[inline]
    pub(crate) fn convert_to_http_request(raw_req: RawRequest) -> Result<Request<Bytes>, io::Error> {
        let RawRequest {
            raw_request: parse_req,
            body
        } = raw_req;

        let method = parse_req.method.ok_or_else(|| io::Error::new(io::ErrorKind::InvalidData, "No method specified"))?;
        let path = parse_req.path.ok_or_else(|| io::Error::new(io::ErrorKind::InvalidData, "No path specified"))?;

        let mut builder = Request::builder()
            .method(method)
            .uri(path)
            .version(Version::HTTP_11); // assuming HTTP/1.1

        for header in parse_req.headers {
            let header_name = HeaderName::from_bytes(header.name.as_bytes())
                .map_err(|e| io::Error::new(io::ErrorKind::InvalidData, format!("Invalid header name: {}", e)))?;

            let header_value = HeaderValue::from_bytes(header.value)
                .map_err(|e| io::Error::new(io::ErrorKind::InvalidData, format!("Invalid header value: {}", e)))?;

            builder = builder.header(header_name, header_value);
        }

        let request = builder.body(body)
            .map_err(|_| io::Error::new(io::ErrorKind::InvalidInput, "Failed to build request"))?;

        Ok(request)
    }
}

pub trait Payload {
    /// Returns a request body deserialized to type of `T`
    /// 
    /// # Example
    /// ```no_run
    ///use volga::{App, AsyncEndpointsMapping, Results, Payload};
    ///use serde::Deserialize;
    /// 
    ///#[derive(Deserialize)]
    ///struct User {
    ///    name: String,
    ///    age: i32
    ///}
    ///
    /// #[tokio::main]
    /// async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    ///     let mut app = App::build("127.0.0.1:7878").await?;
    /// 
    ///     // POST /test
    ///     // { name: "John", age: 35 }
    ///     app.map_post("/test", |req| async move {
    ///         let params: User = req.payload().unwrap();
    /// 
    ///         Results::text("Pass!")
    ///     }).await;
    /// 
    ///     Ok(())
    /// }
    /// ```
    fn payload<'a, T>(&'a self) -> Result<T, io::Error>
    where
        T: Deserialize<'a>;
}

impl Payload for Request<Bytes> {
    fn payload<'a, T>(&'a self) -> Result<T, io::Error>
    where
        T: Deserialize<'a>
    {
        let data: T = serde_json::from_slice(self.body().iter().as_slice())?;
        Ok(data)
    }
}

pub type RequestParams = Arc<HashMap<String, String>>;

pub trait Params {
    /// Returns a query params of HTTP request
    /// 
    /// # Example
    /// ```no_run
    ///use volga::{App, AsyncEndpointsMapping, Results, Params};
    ///
    /// #[tokio::main]
    /// async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    ///     let mut app = App::build("127.0.0.1:7878").await?;
    /// 
    ///     // GET /test?id=11
    ///     app.map_get("/test", |req| async move {
    ///         let params = req.params().unwrap();
    ///         let id = params.get("id").unwrap(); // "11"
    /// 
    ///         Results::text("Pass!")
    ///     }).await;
    /// 
    ///     Ok(())
    /// }
    /// ```
    fn params(&self) -> Option<&RequestParams>;
}

impl Params for Request<Bytes> {
    fn params(&self) -> Option<&RequestParams> {
        if let Some(params) = self.extensions().get::<RequestParams>() {
            Some(params)
        } else {
            None
        }
    }
}
