use std::{
    io::{Error, ErrorKind::InvalidInput},
    fmt::{self, Display, Formatter},
    ops::{Deref, DerefMut}
};

use futures_util::future::{Ready, ready};

use hyper::http::request::Parts;
use serde::de::DeserializeOwned;

use crate::app::endpoints::args::{FromPayload, FromRequestRef, Payload, PayloadType};
use crate::HttpRequest;

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
pub struct Query<T>(pub T);

impl<T> Query<T> {
    pub fn into_inner(self) -> T {
        self.0
    }

    #[inline]
    fn from_serde_error(err: serde::de::value::Error) -> Error {
        Error::new(InvalidInput, err.to_string())
    }

    #[inline]
    fn missing_query_params_error() -> Error {
        Error::new(InvalidInput, "Missing query parameters")
    }
}

impl<T> Deref for Query<T> {
    type Target = T;

    fn deref(&self) -> &T {
        &self.0
    }
}

impl<T> DerefMut for Query<T> {
    fn deref_mut(&mut self) -> &mut T {
        &mut self.0
    }
}

impl<T: Display> Display for Query<T> {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        self.0.fmt(f)
    }
}

impl<T: DeserializeOwned> Query<T> {
    #[inline]
    pub(super) fn from_query_str(query_str: &str) -> Result<Self, Error> {
        serde_urlencoded::from_str::<T>(query_str)
            .map(Query)
            .map_err(Self::from_serde_error)
    }
}

impl<T: DeserializeOwned> FromRequestRef for Query<T> {
    #[inline]
    fn from_request(req: &HttpRequest) -> Result<Self, Error> {
        req.uri().query()
            .ok_or_else(Self::missing_query_params_error)
            .and_then(Self::from_query_str)
    }
}

impl<T: DeserializeOwned + Send> FromPayload for Query<T> {
    type Future = Ready<Result<Self, Error>>;

    #[inline]
    fn from_payload(req: &Parts, _payload: Payload) -> Self::Future {
        let query = req.uri.query()
            .ok_or_else(Self::missing_query_params_error)
            .and_then(Self::from_query_str);
        ready(query)
    }

    #[inline]
    fn payload_type() -> PayloadType {
        PayloadType::Query
    }
}

#[cfg(test)]
mod tests {
    use std::collections::HashMap;
    use serde::Deserialize;
    use crate::Query;

    #[derive(Deserialize)]
    struct User {
        name: String,
        age: i32
    }
    
    #[test]
    fn it_parses_struct_from_request() {
        let query_str = "name=John&age=33";
        
        let query = Query::<User>::from_query_str(query_str).unwrap();
        
        assert_eq!(query.0.name, "John");
        assert_eq!(query.0.age, 33);
    }

    #[test]
    fn it_parses_hash_map_from_request() {
        let query_str = "name=John&age=33";

        let query = Query::<HashMap<String, String>>::from_query_str(query_str).unwrap();

        assert_eq!(query.0.get("name").unwrap(), "John");
        assert_eq!(query.0.get("age").unwrap(), "33");
    }
}