use bytes::{Bytes, Buf};
use std::collections::HashMap;
use std::path::Path;
use std::sync::Arc;
use cancel::Cancel;
use http_body_util::BodyExt;
use hyper::Request;
use hyper::body::{Body, Incoming};
use serde::de::DeserializeOwned;
use tokio_util::sync::CancellationToken;
use tokio::io::{AsyncWriteExt, BufWriter, Error};
use tokio::io::ErrorKind::InvalidInput;
use crate::{File, Params, Payload};

pub mod params;
pub mod payload;
pub mod cancel;
pub mod file;

pub type HttpRequest = Request<Incoming>;
pub type RequestParams = Arc<HashMap<String, String>>;

impl<B: Body<Data = Bytes> + Unpin> File for Request<B>  {
    async fn to_file(mut self, file_path: impl AsRef<Path>) -> Result<(), Error> {
        let file = tokio::fs::File::create(file_path).await?;
        let mut writer = BufWriter::new(file);
        while let Some(next) = self.frame().await {
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
        writer.flush().await?;
        Ok(())
    }
}

impl<B: Body> Payload for Request<B> {
    #[inline]
    async fn payload<T: DeserializeOwned>(self) -> Result<T, Error> {
        let body = self.into_body();
        if let Ok(bytes) = body.collect().await {
            let body = bytes.aggregate();
            let data: T = serde_json::from_reader(body.reader())?;
            Ok(data)
        } else {
            Err(Error::new(InvalidInput, "Unable to read JSON"))
        }
    }
}

impl<B: Body> Params for Request<B> {
    #[inline]
    fn params(&self) -> Option<&RequestParams> {
        self.extensions().get::<RequestParams>()
    }

    #[inline]
    fn param(&self, name: &str) -> Result<&String, Error> {
        self.params()
            .and_then(|params| params.get(name))
            .ok_or(Error::new(InvalidInput, format!("Missing parameter: {name}")))
    }
}

impl<B: Body> Cancel for Request<B> {
    fn cancellation_token(&self) -> CancellationToken {
        if let Some(token) = self.extensions().get::<CancellationToken>() {
            token.clone()
        } else { 
            CancellationToken::new()
        }
    }
}

#[cfg(test)]
mod tests {
    use std::{collections::HashMap, sync::Arc};
    use std::path::Path;
    use serde::Deserialize;
    use tokio_util::sync::CancellationToken;
    use crate::{Cancel, File, Params, Payload};
    use crate::app::body::HttpBody;
    use crate::test_utils::read_file;

    #[derive(Deserialize)]
    struct TestPayload {
        name: String
    }

    #[tokio::test]  
    async fn it_parses_payload() {
        let request_body = "{\"name\":\"test\"}";
        let request = hyper::Request::new(HttpBody::full(request_body));

        let payload: TestPayload = request.payload().await.unwrap();

        assert_eq!(payload.name, "test");
    }

    #[test]
    fn it_reads_params() {
        let mut params = HashMap::new();
        params.insert(String::from("name"), String::from("test"));

        let mut request = hyper::Request::new(HttpBody::empty());
        request.extensions_mut().insert(Arc::new(params));

        let request_params = request.params().unwrap();

        assert_eq!(request_params.len(), 1);

        let name = request_params.get("name").unwrap();

        assert_eq!(name, "test");
    }

    #[test]
    fn it_reads_param() {
        let mut params = HashMap::new();
        params.insert(String::from("name"), String::from("test"));

        let mut request = hyper::Request::new(HttpBody::empty());
        request.extensions_mut().insert(Arc::new(params));

        let name = request.param("name").unwrap();

        assert_eq!(name, "test");
    }

    #[test]
    fn it_cancels() {
        let token = CancellationToken::new();

        let mut request = hyper::Request::new(HttpBody::empty());
        request.extensions_mut().insert(token.clone());

        let req_token = request.cancellation_token();
        req_token.cancel();

        assert!(token.is_cancelled());
    }

    #[tokio::test]
    async fn it_saves_request_body_to_file() {
        let path = Path::new("tests/resources/test_file.txt");

        let file = tokio::fs::File::open(path).await.unwrap();
        let body = HttpBody::wrap_stream(file);
        
        let request = hyper::Request::new(body);

        let path = Path::new("tests/resources/test_file_saved.txt");
        request.to_file(path).await.unwrap();

        let saved_bytes = read_file(path).await;        
        let content = String::from_utf8_lossy(&saved_bytes);
        
        assert_eq!(content, "Hello, this is some file content!");
        assert_eq!(content.len(), 33);
    }
}
