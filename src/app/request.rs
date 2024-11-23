use bytes::{Bytes, Buf};
use std::collections::HashMap;
use std::path::Path;
use std::str::FromStr;
use cancel::Cancel;
use http_body_util::BodyExt;
use hyper::Request;
use hyper::body::{Body, Incoming};
use serde::de::DeserializeOwned;
use tokio_util::sync::CancellationToken;
use tokio::io::{AsyncWriteExt, BufWriter, Error};
use tokio::io::ErrorKind::InvalidInput;
use crate::Params;

#[cfg(feature = "async")]
use crate::Payload;
#[cfg(feature = "sync")]
use crate::SyncPayload;

#[cfg(feature = "async")]
use crate::File;
#[cfg(feature = "sync")]
use crate::SyncFile;

pub mod params;
pub mod payload;
pub mod cancel;
pub mod file;
pub type HttpRequest = Request<Incoming>;
pub type RequestParams = HashMap<String, String>;

struct Utils;

impl Utils {
    #[inline]
    async fn deserialize<B: Body, T: DeserializeOwned>(req: Request<B>) -> Result<T, Error> {
        let body = req.into_body();
        if let Ok(bytes) = body.collect().await {
            let body = bytes.aggregate();
            let data: T = serde_json::from_reader(body.reader())?;
            Ok(data)
        } else {
            Err(Error::new(InvalidInput, "Unable to read JSON"))
        }
    }
    
    #[inline]
    async fn save_file<B: Body<Data = Bytes> + Unpin>(mut req: Request<B>, file_path: impl AsRef<Path>) -> Result<(), Error> {
        let file = tokio::fs::File::create(file_path).await?;
        let mut writer = BufWriter::new(file);
        while let Some(next) = req.frame().await {
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

#[cfg(feature = "async")]
impl<B: Body<Data = Bytes> + Unpin> File for Request<B>  {
    async fn to_file(self, file_path: impl AsRef<Path>) -> Result<(), Error> {
        Utils::save_file(self, file_path).await
    }
}

#[cfg(feature = "sync")]
impl<B: Body<Data = Bytes> + Unpin> SyncFile for Request<B>  {
    fn to_file(self, file_path: impl AsRef<Path>) -> Result<(), Error> {
        let rt = tokio::runtime::Runtime::new()?;
        rt.block_on(Utils::save_file(self, file_path))
    }
}

#[cfg(feature = "async")]
impl<B: Body> Payload for Request<B> {
    #[inline]
    async fn payload<T: DeserializeOwned>(self) -> Result<T, Error> {
        Utils::deserialize(self).await
    }
}

#[cfg(feature = "sync")]
impl<B: Body> SyncPayload for Request<B> {
    #[inline]
    fn payload<T: DeserializeOwned>(self) -> Result<T, Error> {
        let rt = tokio::runtime::Runtime::new()?;
        rt.block_on(Utils::deserialize(self))
    }
}

impl<B: Body> Params for Request<B> {
    #[inline]
    fn params(&self) -> Option<&RequestParams> {
        self.extensions().get::<RequestParams>()
    }

    fn param<T: FromStr>(&self, name: &str) -> Result<T, Error> {
        self.params()
            .and_then(|params| params.get(name))
            .and_then(|param| param.parse().ok())
            .ok_or(Error::new(InvalidInput, format!("Missing parameter: {name}")))
    }

    fn param_str(&self, name: &str) -> Result<&str, Error> {
        self.params()
            .and_then(|params| params.get(name))
            .map(|param| param.as_str())
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
    use std::collections::HashMap;
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
        request.extensions_mut().insert(params);

        let request_params = request.params().unwrap();

        assert_eq!(request_params.len(), 1);

        let name = request_params.get("name").unwrap();

        assert_eq!(name, "test");
    }

    #[test]
    fn it_reads_param() {
        let mut params = HashMap::new();
        params.insert(String::from("age"), String::from("33"));

        let mut request = hyper::Request::new(HttpBody::empty());
        request.extensions_mut().insert(params);

        let age: u32 = request.param("age").unwrap();

        assert_eq!(age, 33);
    }
    
    #[test]
    fn it_reads_param_str() {
        let mut params = HashMap::new();
        params.insert(String::from("name"), String::from("test"));

        let mut request = hyper::Request::new(HttpBody::empty());
        request.extensions_mut().insert(params);

        let name = request.param_str("name").unwrap();

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
