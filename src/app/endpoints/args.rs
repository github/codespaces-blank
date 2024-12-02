use std::future::Future;
use std::io::Error;

use hyper::body::Incoming;
use hyper::http::request::Parts;

use crate::HttpRequest;
use crate::app::endpoints::route::PathArguments;

pub mod path;
pub mod query;
pub mod headers;
pub mod json;
pub mod file;
pub mod cancellation_token;

pub(crate) enum Payload {
    None,
    Body(Incoming),
    Path((String, String))
}

pub(crate) enum PayloadType {
    None,
    Path,
    Query,
    Headers,
    Body
}

pub trait FromRequest: Sized {
    fn from_request(req: HttpRequest) -> impl Future<Output = Result<Self, Error>> + Send;
}

pub(crate) trait FromPayload: Send + Sized {
    type Future: Future<Output = Result<Self, Error>> + Send;
    
    fn from_payload(req: &Parts, payload: Payload) -> Self::Future;

    fn payload_type() -> PayloadType {
        PayloadType::None
    }
}

impl FromRequest for () {
    #[inline]
    async fn from_request(_req: HttpRequest) -> Result<Self, Error> {
        Ok(())
    }
}

macro_rules! define_generic_from_request {
    ($($T: ident),*) => {
        impl<$($T: FromPayload),+> FromRequest for ($($T,)+) {
            #[inline]
            async fn from_request(req: HttpRequest) -> Result<Self, Error> {
                let (parts, body) = req.into_parts();
                let params = parts.extensions.get::<PathArguments>()
                    .map(|params| &params[..])
                    .unwrap_or(&[]);
                
                let mut body = Some(body);
                let mut iter = params.iter();
                let tuple = (
                    $(
                    $T::from_payload(&parts, match $T::payload_type() { 
                        PayloadType::Path => match iter.next() {
                            Some(param) => Payload::Path(param.clone()),
                            None => Payload::None
                        },
                        PayloadType::Body => match body.take() {
                            Some(body) => Payload::Body(body),
                            None => Payload::None
                        },
                        _ => Payload::None
                    }).await?,
                    )*    
                );
                Ok(tuple)
            }
        }
    }
}

define_generic_from_request! { T1 }
define_generic_from_request! { T1, T2 }
define_generic_from_request! { T1, T2, T3 }
define_generic_from_request! { T1, T2, T3, T4 }
define_generic_from_request! { T1, T2, T3, T4, T5 }
define_generic_from_request! { T1, T2, T3, T4, T5, T6 }
define_generic_from_request! { T1, T2, T3, T4, T5, T6, T7 }
define_generic_from_request! { T1, T2, T3, T4, T5, T6, T7, T8 }
define_generic_from_request! { T1, T2, T3, T4, T5, T6, T7, T8, T9 }
define_generic_from_request! { T1, T2, T3, T4, T5, T6, T7, T8, T9, T10 }