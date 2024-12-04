//! Extractors for typed JSON data

use bytes::Buf;
use futures_util::future::BoxFuture;
use http_body_util::BodyExt;
use hyper::http::request::Parts;
use serde::de::DeserializeOwned;

use std::{
    io::{Error, ErrorKind::InvalidInput},
    fmt::{self, Display, Formatter},
    ops::{Deref, DerefMut}
};

use crate::app::endpoints::args::{
    FromPayload, 
    Payload,
    Source
};

/// Wraps typed JSON data
///
/// # Example
/// ```no_run
/// use volga::{HttpResult, Json, ok};
/// use serde::Deserialize;
///
/// #[derive(Deserialize)]
/// struct User {
///     name: String,
/// }
///
/// async fn handle(user: Json<User>) -> HttpResult {
///     ok!("Hello {}", user.name)
/// }
/// ```
#[derive(Debug)]
pub struct Json<T>(pub T);

impl<T> Json<T> {
    /// Unwraps the inner `T`
    pub fn into_inner(self) -> T {
        self.0
    }
}

impl<T> Deref for Json<T> {
    type Target = T;

    fn deref(&self) -> &T {
        &self.0
    }
}

impl<T> DerefMut for Json<T> {
    fn deref_mut(&mut self) -> &mut T {
        &mut self.0
    }
}

impl<T: Display> Display for Json<T> {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        Display::fmt(&self.0, f)
    }
}

/// Extracts JSON data from request body into `Json<T>`
/// where T is deserializable `struct`
impl<T: DeserializeOwned + Send> FromPayload for Json<T> {
    type Future = BoxFuture<'static, Result<Self, Error>>;

    fn from_payload(_: &Parts, payload: Payload) -> Self::Future {
        Box::pin(async move {
            match payload {
                Payload::Body(body) => {
                    if let Ok(bytes) = body.collect().await {
                        let body = bytes.aggregate();
                        let data: T = serde_json::from_reader(body.reader())?;
                        Ok(Json(data))
                    } else {
                        Err(Error::new(InvalidInput, "Unable to read JSON"))
                    }
                },
                _ => Err(Error::new(InvalidInput, "Body has already been consumed"))
            } 
        })
    }

    fn source() -> Source {
        Source::Body
    }
}