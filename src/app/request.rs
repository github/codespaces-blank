use std::collections::HashMap;
use std::io;
use std::sync::Arc;
use bytes::Bytes;
use http::{Request, Version};
use http::header::{HeaderName, HeaderValue};
use httparse::{Header, Request as HttParseRequest};
use serde::Deserialize;
use crate::{Params, Payload};

pub mod params;
pub mod payload;

pub type HttpRequest = Request<Bytes>;
pub type RequestParams = Arc<HashMap<String, String>>;

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
    pub(crate) fn convert_to_http_request(raw_req: RawRequest) -> Result<HttpRequest, io::Error> {
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

impl Payload for HttpRequest {
    fn payload<'a, T>(&'a self) -> Result<T, io::Error>
    where
        T: Deserialize<'a>
    {
        let data: T = serde_json::from_slice(self.body().iter().as_slice())?;
        Ok(data)
    }
}

impl Params for HttpRequest {
    fn params(&self) -> Option<&RequestParams> {
        self.extensions().get::<RequestParams>()
    }

    fn param(&self, name: &str) -> Option<&String> {
        self.extensions().get::<RequestParams>()
            .and_then(|params| params.get(name))
    }
}
