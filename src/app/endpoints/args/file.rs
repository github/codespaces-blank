use std::io::{Error, ErrorKind::InvalidInput};
use std::path::Path;

use bytes::Bytes;

use futures_util::future::BoxFuture;
use http_body_util::BodyExt;

use hyper::http::request::Parts;
use hyper::body::{Body, Incoming};

use tokio::io::{AsyncWriteExt, BufWriter};

use crate::app::endpoints::args::{
    FromPayload,
    Payload, 
    PayloadType
};

pub type File = FileStream<Incoming>;

pub struct FileStream<B: Body<Data = Bytes> + Unpin> {
    stream: B
}

impl<B: Body<Data = Bytes> + Unpin> FileStream<B> {
    fn new(stream: B) -> Self {
        Self { stream }
    }
    
    #[inline]
    pub async fn save(self, file_path: impl AsRef<Path>) -> Result<(), Error> {
        let file = tokio::fs::File::create(file_path).await?;
        
        let mut writer = BufWriter::new(file);
        let mut stream = self.stream;
        
        while let Some(next) = stream.frame().await {
            match next {
                Ok(frame) => {
                    if let Some(chunk) = frame.data_ref() {
                        writer.write_all(chunk).await?
                    } else {
                        break
                    }
                },
                Err(_) => return Err(Error::new(InvalidInput, "Unable to read a file"))
            };
        }
        writer.flush().await
    }
}

impl FromPayload for File {
    type Future = BoxFuture<'static, Result<Self, Error>>;

    #[inline]
    fn from_payload(_req: &Parts, payload: Payload) -> Self::Future {
        Box::pin(async move {
            match payload {
                Payload::Body(body) => {
                    Ok(FileStream::new(body))
                },
                _ => Err(Error::new(InvalidInput, "Body has already been consumed"))
            }
        })
    }

    #[inline]
    fn payload_type() -> PayloadType {
        PayloadType::Body
    }
}

#[cfg(test)]
mod tests {
    use std::path::Path;
    use crate::app::body::HttpBody;
    use crate::app::endpoints::args::file::FileStream;
    use crate::test_utils::read_file;

    #[tokio::test]
    async fn it_saves_request_body_to_file() {
        let path = Path::new("tests/resources/test_file.txt");

        let file = tokio::fs::File::open(path).await.unwrap();
        let body = HttpBody::wrap_stream(file);

        let file_stream = FileStream::new(body);

        let path = Path::new("tests/resources/test_file_saved.txt");
        file_stream.save(path).await.unwrap();

        let saved_bytes = read_file(path).await;
        let content = String::from_utf8_lossy(&saved_bytes);

        assert_eq!(content, "Hello, this is some file content!");
        assert_eq!(content.len(), 33);
    }
}