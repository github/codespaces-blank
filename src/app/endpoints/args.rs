//! Extractors for HTTP request parts and body

use std::{io::Error, future::Future};
use hyper::{
    http::Extensions, 
    body::Incoming, 
    Uri, 
    HeaderMap, 
};

use crate::{app::endpoints::route::PathArguments, HttpRequest};

#[cfg(feature = "di")]
use crate::app::di::Container;

pub mod path;
pub mod query;
pub mod headers;
pub mod json;
pub mod file;
pub mod cancellation_token;
pub mod request;
#[cfg(feature = "di")]
pub mod dc;

/// Holds the payload for extractors
pub(crate) enum Payload<'a> {
    None,
    Full(HttpRequest),
    Body(Incoming),
    Query(&'a Uri),
    Headers(&'a HeaderMap),
    Path(&'a (String, String)),
    Ext(&'a Extensions),
    #[cfg(feature = "di")]
    Dc(&'a mut Container)
}

/// Describes a data source for extractors to read from
pub(crate) enum Source {
    None,
    Full,
    Path,
    Query,
    Headers,
    Body,
    Ext,
    #[cfg(feature = "di")]
    Dc
}

/// Specifies extractors to read data from HTTP request
pub trait FromRequest: Sized {
    fn from_request(req: HttpRequest) -> impl Future<Output = Result<Self, Error>> + Send;
}

/// Specifies extractors to read data from HTTP request
pub trait FromRequestRef: Sized {
    fn from_request(req: &HttpRequest) -> Result<Self, Error>;
}

/// Specifies extractor to read data from HTTP request
/// depending on payload's [`Source`]
pub(crate) trait FromPayload: Send + Sized {
    type Future: Future<Output = Result<Self, Error>> + Send;
    
    /// Extracts data from give [`Payload`]
    fn from_payload(payload: Payload) -> Self::Future;

    /// Returns a [`Source`] where payload should be extracted from
    fn source() -> Source {
        Source::None
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
                #[cfg(feature = "di")]
                let (parts, body, mut container) = req.into_parts();
                #[cfg(not(feature = "di"))]
                let (parts, body) = req.into_parts();
                
                let params = parts.extensions.get::<PathArguments>()
                    .map(|params| &params[..])
                    .unwrap_or(&[]);
                
                let mut body = Some(body);
                let mut iter = params.iter();
                let tuple = (
                    $(
                    $T::from_payload(match $T::source() {
                        Source::None => Payload::None,
                        Source::Query => Payload::Query(&parts.uri),
                        Source::Headers => Payload::Headers(&parts.headers),
                        Source::Ext => Payload::Ext(&parts.extensions),
                        #[cfg(feature = "di")]
                        Source::Dc => Payload::Dc(&mut container),
                        Source::Path => match iter.next() {
                            Some(param) => Payload::Path(&param),
                            None => Payload::None
                        },
                        Source::Body => match body.take() {
                            Some(body) => Payload::Body(body),
                            None => Payload::None
                        },
                        Source::Full => match body.take() {
                            Some(body) => {
                                #[cfg(feature = "di")]
                                let req = Payload::Full(HttpRequest::from_parts(parts.clone(), body, container.clone()));
                                #[cfg(not(feature = "di"))]
                                let req = Payload::Full(HttpRequest::from_parts(parts.clone(), body));
                                req
                            },
                            None => Payload::None
                        },
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