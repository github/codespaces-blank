use std::io::Error;
use tokio::fs::File;
use bytes::{Bytes};
use futures_util::TryStreamExt;
use http_body_util::{BodyExt, Empty, Full, StreamBody};
use hyper::body::Frame;
use tokio_util::io::ReaderStream;
use serde::Serialize;

pub type BoxBody = http_body_util::combinators::BoxBody<Bytes, Error>;

pub struct HttpBody;

impl HttpBody {
    #[inline]
    pub fn json<T: Serialize>(content: T) -> BoxBody {
        match serde_json::to_vec(&content) {
            Ok(content) => Full::from(content)
                .map_err(|never| match never {})
                .boxed(),
            Err(e) => {
                let error_message = format!("JSON serialization error: {}", e);
                Full::from(Bytes::from(error_message))
                    .map_err(|never| match never {})
                    .boxed()
            }
        }
    }
    
    #[inline]
    pub fn full<T: Into<Bytes>>(chunk: T) -> BoxBody {
        Full::new(chunk.into())
            .map_err(|never| match never {})
            .boxed()
    }

    #[inline]
    pub fn empty() -> BoxBody {
        Empty::<Bytes>::new()
            .map_err(|never| match never {})
            .boxed()
    }
    
    #[inline]
    pub fn wrap_stream(content: File) -> BoxBody {
        let reader_stream = ReaderStream::new(content);
        let stream_body = StreamBody::new(reader_stream.map_ok(Frame::data));
        stream_body.boxed()
    }
}


