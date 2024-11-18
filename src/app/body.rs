use std::io::Error;
use tokio::fs::File;
use bytes::{Bytes};
use futures_util::TryStreamExt;
use http_body_util::{BodyExt, Empty, Full, StreamBody};
use hyper::body::Frame;
use tokio_util::io::ReaderStream;

pub type BoxBody = http_body_util::combinators::BoxBody<Bytes, Error>;

pub(crate) struct HttpBody;

impl HttpBody {
    #[inline]
    pub(crate) fn full<T: Into<Bytes>>(chunk: T) -> BoxBody {
        Full::new(chunk.into())
            .map_err(|never| match never {})
            .boxed()
    }

    #[inline]
    pub(crate) fn empty() -> BoxBody {
        Empty::<Bytes>::new()
            .map_err(|never| match never {})
            .boxed()
    }
    
    #[inline]
    pub(crate) fn wrap_stream(content: File) -> BoxBody {
        let reader_stream = ReaderStream::new(content);
        let stream_body = StreamBody::new(reader_stream.map_ok(Frame::data));

        stream_body.boxed()
    }
}


