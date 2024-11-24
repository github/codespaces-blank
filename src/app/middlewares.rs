﻿use std::sync::Arc;
use futures_util::future::BoxFuture;
use crate::{HttpContext, HttpResult, Results};

pub mod mapping;

pub type Next = Arc<dyn Fn(HttpContext) -> BoxFuture<'static, HttpResult> + Send + Sync>;
type Middleware = Arc<dyn Fn(HttpContext, Next) -> BoxFuture<'static, HttpResult> + Send + Sync>;

pub(crate) struct Middlewares {
    pipeline: Vec<Middleware>
}

impl Middlewares {
    pub(super) fn new() -> Self {
        Self { pipeline: Vec::new() }
    }

    pub(crate) fn is_empty(&self) -> bool {
        self.pipeline.is_empty()
    }

    pub(crate) fn compose(&self) -> Option<Next> {
        if self.pipeline.is_empty() {
            return None;
        }

        // Fetching the last middleware which is the request handler to be the initial `next`.
        let request_handler = self.pipeline.last().unwrap().clone();
        let mut next: Next = Arc::new(move |ctx| {
            let handler = request_handler.clone();
            // Call the last middleware, ignoring its `next` argument with an empty placeholder
            Box::pin(async move {
                handler(ctx, Arc::new(|_| Box::pin(async { Results::not_found() }))).await
            })
        });

        for mw in self.pipeline.iter().rev().skip(1) {
            let current_mw: Middleware = mw.clone();
            let prev_next: Next = next.clone();

            next = Arc::new(move |ctx| {
                let current_mw = current_mw.clone();
                let prev_next = prev_next.clone();
                Box::pin(async move {
                    current_mw(ctx, prev_next).await
                })
            });
        }
        Some(next)
    }
}

