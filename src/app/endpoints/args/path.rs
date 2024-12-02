use std::{
    io::{Error, ErrorKind::{InvalidInput, InvalidData}},
    fmt::{self, Display, Formatter},
    ops::{Deref, DerefMut}
};
use std::str::FromStr;
use futures_util::future::{ready, Ready};
use hyper::http::request::Parts;
use serde::de::DeserializeOwned;
use crate::app::endpoints::args::{FromPayload, Payload, PayloadType};
use crate::app::endpoints::route::PathArguments;

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord)]
pub struct Path<T>(pub T);

impl<T> Path<T> {
    pub fn into_inner(self) -> T {
        self.0
    }

    #[inline]
    fn from_serde_error(err: serde::de::value::Error) -> Error {
        Error::new(InvalidInput, err.to_string())
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
    #[inline]
    pub(super) fn from_str(route_params: &[(String, String)]) -> Result<Self, Error> {
        let route_str = route_params
            .iter()
            .map(|(key, value)| format!("{}={}", key, value))
            .collect::<Vec<String>>()
            .join("&");
        
        serde_urlencoded::from_str::<T>(&route_str)
            .map(Path)
            .map_err(Self::from_serde_error)
    }
}

impl<T: DeserializeOwned + Send> FromPayload for Path<T> {
    type Future = Ready<Result<Self, Error>>;

    #[inline]
    fn from_payload(req: &Parts, _payload: Payload) -> Self::Future {
        let result = Self::from_str(req.extensions.get::<PathArguments>().unwrap());
        ready(result)
    }
}

impl<T: FromStr + Send> FromPayload for T {
    type Future = Ready<Result<Self, Error>>;

    #[inline]
    fn from_payload(_req: &Parts, payload: Payload) -> Self::Future {
        match payload {
            Payload::Path((_arg, value)) => {
                let value = value.parse::<T>()
                    .map_err(|_| Error::new(InvalidData, "Arguments parse error"));
                ready(value)
            },
            _ => ready(Err(Error::new(InvalidData, "Method not supported")))
        }
    }

    #[inline]
    fn payload_type() -> PayloadType {
        PayloadType::Path
    }
}
