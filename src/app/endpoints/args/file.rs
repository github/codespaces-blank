//! Extractors for file stream

use bytes::Bytes;
use futures_util::future::BoxFuture;
use http_body_util::BodyExt;
use tokio::io::{AsyncWriteExt, BufWriter};

use std::{
    io::{Error, ErrorKind::InvalidInput},
    path::Path
};

use hyper::{
    body::{Body, Incoming},
    http::request::Parts
};

use crate::app::endpoints::args::{
    FromPayload,
    Payload,
    Source
};

/// See [`FileStream<B>`] for more details.
pub type File = FileStream<Incoming>;

/// Describes a single file stream
/// 
/// # Example
/// ```no_run
/// use volga::{HttpResult, File, ok};
///
/// async fn handle(file: File) -> HttpResult {
///     file.save("example.txt").await?;        
///     ok!("File saved!")
/// }
/// ```
pub struct FileStream<B: Body<Data = Bytes> + Unpin> {
    stream: B
}

impl<B: Body<Data = Bytes> + Unpin> FileStream<B> {
    fn new(stream: B) -> Self {
        Self { stream }
    }
    
    /// Asynchronously writes a file stream to disk
    /// # Example
    /// ```no_run
    /// # use volga::{HttpResult, ok};
    /// use volga::File;
    ///
    /// # async fn handle(file: File) -> HttpResult {
    /// file.save("path/to/file.txt").await?;        
    /// # ok!("File saved!")
    /// # }
    /// ```
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

/// Extracts a file stream from request body
impl FromPayload for File {
    type Future = BoxFuture<'static, Result<Self, Error>>;

    #[inline]
    fn from_payload(_: &Parts, payload: Payload) -> Self::Future {
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
    fn source() -> Source {
        Source::Body
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