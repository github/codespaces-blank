//! Extractors for route/path segments

use futures_util::future::{ready, Ready};
use hyper::http::Extensions;
use serde::de::DeserializeOwned;

use std::{
    fmt::{self, Display, Formatter},
    io::{Error, ErrorKind::{InvalidData, InvalidInput}},
    ops::{Deref, DerefMut},
    str::FromStr
};

use crate::HttpRequest;
use crate::http::endpoints::{
    args::{FromPayload, FromRequestRef, Payload, Source},
    route::PathArguments
};

/// Wraps typed data extracted from path args
/// 
/// # Example
/// ```no_run
/// use volga::{HttpResult, Path, ok};
/// use serde::Deserialize;
/// 
/// #[derive(Deserialize)]
/// struct Params {
///     name: String,
/// }
/// 
/// async fn handle(params: Path<Params>) -> HttpResult {
///     ok!("Hello {}", params.name)
/// }
/// ```
#[derive(Debug, PartialEq, Eq, PartialOrd, Ord)]
pub struct Path<T>(pub T);

impl<T> Path<T> {
    /// Unwraps the inner `T`
    pub fn into_inner(self) -> T {
        self.0
    }
}

impl<T> Deref for Path<T> {
    type Target = T;

    fn deref(&self) -> &T {
        &self.0
    }
}

impl<T> DerefMut for Path<T> {
    fn deref_mut(&mut self) -> &mut T {
        &mut self.0
    }
}

impl<T: Display> Display for Path<T> {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        self.0.fmt(f)
    }
}

impl<T: DeserializeOwned> Path<T> {
    /// Parses the slice of tuples `(String, String)` into [`Path<T>`]
    #[inline]
    pub(crate) fn from_slice(route_params: &[(String, String)]) -> Result<Self, Error> {
        let route_str = route_params
            .iter()
            .map(|(key, value)| format!("{}={}", key, value))
            .collect::<Vec<String>>()
            .join("&");
        
        serde_urlencoded::from_str::<T>(&route_str)
            .map(Path)
            .map_err(PathError::from_serde_error)
    }
    
    /// Parses request extensions intro [`Path<T>`]
    #[inline]
    pub(crate) fn from_extensions(extensions: &Extensions) -> Result<Self, Error> {
        extensions
            .get::<PathArguments>()
            .ok_or_else(PathError::args_missing)
            .and_then(|params| Self::from_slice(params))
    }
}

/// Extracts path args from request parts into `Path<T>`
/// where T is deserializable `struct`
impl<T: DeserializeOwned + Send> FromPayload for Path<T> {
    type Future = Ready<Result<Self, Error>>;

    #[inline]
    fn from_payload(payload: Payload) -> Self::Future {
        if let Payload::Ext(extensions) = payload {
            ready(Self::from_extensions(extensions))
        } else {
            unreachable!()
        }
    }

    #[inline]
    fn source() -> Source {
        Source::Ext
    }
}

/// Extracts path args from request into `Path<T>`
/// where T is deserializable `struct`
impl<T: DeserializeOwned + Send> FromRequestRef for Path<T> {
    #[inline]
    fn from_request(req: &HttpRequest) -> Result<Self, Error> {
        Self::from_extensions(req.extensions())
    }
}

/// Extracts path args directly into handler method args that implements `FromStr`
impl<T: FromStr + Send> FromPayload for T {
    type Future = Ready<Result<Self, Error>>;

    #[inline]
    fn from_payload(payload: Payload) -> Self::Future {
        if let Payload::Path((arg, value)) = payload {
            ready(value.parse::<T>().map_err(|_| PathError::type_mismatch(arg)))
        } else {
            unreachable!()
        }
    }

    #[inline]
    fn source() -> Source {
        Source::Path
    }
}

/// Describes errors of path extractor
struct PathError;

impl PathError {
    #[inline]
    fn from_serde_error(err: serde::de::value::Error) -> Error {
        Error::new(InvalidInput, format!("Path parsing error: {}", err))
    }

    #[inline]
    fn type_mismatch(arg: &str) -> Error {
        Error::new(InvalidData, format!("Path parsing error: argument `{arg}` type mismatch"))
    }

    #[inline]
    fn args_missing() -> Error {
        Error::new(InvalidData, "Path parsing error: missing arguments")
    }
}

#[cfg(test)]
mod tests {
    use hyper::http::Extensions;
    use serde::Deserialize;
    use crate::Path;
    use crate::http::endpoints::route::PathArguments;
    use crate::http::endpoints::args::{FromPayload, Payload};

    #[derive(Deserialize)]
    struct Params {
        id: u32,
        name: String
    }

    #[tokio::test]
    async fn it_reads_from_payload() {
        let param = ("id".to_string(), "123".to_string());
        
        let id = i32::from_payload(Payload::Path(&param)).await.unwrap();
        
        assert_eq!(id, 123);
    }

    #[tokio::test]
    async fn it_reads_path_from_payload() {
        let args: PathArguments = vec![
            ("id".to_string(), "123".to_string()),
            ("name".to_string(), "John".to_string())
        ];
        
        let mut ext = Extensions::new();
        ext.insert(args);

        let path = Path::<Params>::from_payload(Payload::Ext(&ext)).await.unwrap();

        assert_eq!(path.id, 123u32);
        assert_eq!(path.name, "John")
    }
    
    #[test]
    fn it_parses_slice() {
        let slice = [
            ("id".to_string(), "123".to_string()),
            ("name".to_string(), "John".to_string())
        ];
        
        let path = Path::<Params>::from_slice(&slice).unwrap();
        
        assert_eq!(path.id, 123u32);
        assert_eq!(path.name, "John")
    }

    #[test]
    fn it_parses_request_extensions() {
        let args: PathArguments = vec![
            ("id".to_string(), "123".to_string()),
            ("name".to_string(), "John".to_string())
        ];
        
        let mut ext = Extensions::new();
        ext.insert(args);

        let path = Path::<Params>::from_extensions(&ext).unwrap();

        assert_eq!(path.id, 123u32);
        assert_eq!(path.name, "John")
    }
}
