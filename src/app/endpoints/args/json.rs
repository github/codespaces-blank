//! Extractors for typed JSON data

use bytes::Buf;
use futures_util::ready;
use hyper::body::Incoming;
use pin_project_lite::pin_project;
use serde::de::DeserializeOwned;

use http_body_util::{combinators::Collect, BodyExt};

use std::{
    future::Future,
    fmt::{self, Display, Formatter},
    io::{Error, ErrorKind::InvalidInput},
    marker::PhantomData,
    ops::{Deref, DerefMut},
    pin::Pin,
    task::{Context, Poll}
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

pin_project! {
    /// A future that collects an incoming body stream into bytes and deserializes it into a JSON object.
    pub struct ExtractJsonPayloadFut<T> {
        #[pin]
        fut: Collect<Incoming>,
        _marker: PhantomData<T>
    }
}

impl<T: DeserializeOwned + Send> Future for ExtractJsonPayloadFut<T> {
    type Output = Result<Json<T>, Error>;

    #[inline]
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
        let this = self.project();
        let result = ready!(this.fut.poll(cx))
            .map_err(JsonError::collect_error)?;
        let body = result.aggregate();
        let json = serde_json::from_reader(body.reader())
            .map(Json::<T>)
            .map_err(JsonError::from_serde_error);
        Poll::Ready(json)
    }
}

/// Extracts JSON data from request body into `Json<T>`
/// where T is deserializable `struct`
impl<T: DeserializeOwned + Send> FromPayload for Json<T> {
    type Future = ExtractJsonPayloadFut<T>;

    fn from_payload(payload: Payload) -> Self::Future {
        if let Payload::Body(body) = payload {
            ExtractJsonPayloadFut { fut: body.collect(), _marker: PhantomData }
        } else {
            unreachable!()
        }
    }

    fn source() -> Source {
        Source::Body
    }
}

struct JsonError;

impl JsonError {
    #[inline]
    fn from_serde_error(err: serde_json::Error) -> Error {
        Error::new(InvalidInput, format!("JSON parsing error: {}", err))
    }

    #[inline]
    fn collect_error(err: hyper::Error) -> Error {
        Error::new(InvalidInput, format!("JSON parsing error: {}", err))
    }
}