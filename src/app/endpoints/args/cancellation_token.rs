use std::{
    io::Error,
    ops::{Deref, DerefMut}
};

use futures_util::future::{ready, Ready};
use tokio_util::sync::CancellationToken as TokioCancellationToken;

use hyper::http::request::Parts;

use crate::app::endpoints::args::{FromPayload, Payload};

pub type CancellationToken = TokenGuard;

pub struct TokenGuard(TokioCancellationToken);

impl TokenGuard {
    pub fn new(cancellation_token: TokioCancellationToken) -> Self {
        Self(cancellation_token)
    }
    
    #[inline]
    pub fn into_inner(self) -> TokioCancellationToken {
        self.0
    }
}

impl Deref for TokenGuard {
    type Target = TokioCancellationToken;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl DerefMut for TokenGuard {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

impl Clone for TokenGuard {
    fn clone(&self) -> Self {
        Self::new(self.0.clone())
    }

    fn clone_from(&mut self, source: &Self) {
        self.0.clone_from(&source.0);
    }
}

impl FromPayload for TokenGuard {
    type Future = Ready<Result<Self, Error>>;

    #[inline]
    fn from_payload(req: &Parts, _: Payload) -> Self::Future {
        let token = match req.extensions.get::<TokioCancellationToken>() {
            Some(token) => token.clone(),
            None => TokioCancellationToken::new(),
        };
        ready(Ok(TokenGuard::new(token)))
    }
}