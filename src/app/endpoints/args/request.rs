//! Extractors for the whole HTTP request

use crate::HttpRequest;
use std::io::Error;
use futures_util::future::{ok, Ready};

use crate::app::endpoints::args::{
    FromPayload,
    Payload,
    Source
};

impl FromPayload for HttpRequest {
    type Future = Ready<Result<Self, Error>>;

    #[inline]
    fn from_payload(payload: Payload) -> Self::Future {
        if let Payload::Full(req) = payload {
            ok(req)
        } else {
            unreachable!()
        }
    }

    fn source() -> Source {
        Source::Full
    }
}