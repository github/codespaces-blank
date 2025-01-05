﻿//! Middleware tools

use futures_util::future::BoxFuture;
use std::{future::Future, sync::Arc};

pub use http_context::HttpContext;

use crate::{
    App,
    HttpResult,
    status
};

#[cfg(any(
    feature = "brotli",
    feature = "gzip",
    feature = "zstd",
    feature = "compression-full"
))]
pub mod compress;
pub mod http_context;

/// Points to the next middleware or request handler
pub type Next = Arc<
    dyn Fn(HttpContext) -> BoxFuture<'static, HttpResult> 
    + Send
    + Sync
>;

/// Point to a middleware function
type MiddlewareFn = Arc<
    dyn Fn(HttpContext, Next) -> BoxFuture<'static, HttpResult> 
    + Send
    + Sync
>;

pub(super) struct Middlewares {
    pipeline: Vec<MiddlewareFn>
}

impl Middlewares {
    /// Initializes a new middleware pipeline
    pub(super) fn new() -> Self {
        Self { pipeline: Vec::new() }
    }

    /// Returns `true` if there are no middlewares,
    /// otherwise `false`
    pub(super) fn is_empty(&self) -> bool {
        self.pipeline.is_empty()
    }

    /// Composes middlewares into a "Linked List" and returns head
    pub(super) fn compose(&self) -> Option<Next> {
        if self.pipeline.is_empty() {
            return None;
        }

        // Fetching the last middleware which is the request handler to be the initial `next`.
        let request_handler = self.pipeline.last().unwrap().clone();
        let mut next: Next = Arc::new(move |ctx| {
            let handler = request_handler.clone();
            // Call the last middleware, ignoring its `next` argument with an empty placeholder
            Box::pin(async move {
                handler(ctx, Arc::new(|_| Box::pin(async { status!(404) }))).await
            })
        });

        for mw in self.pipeline.iter().rev().skip(1) {
            let current_mw: MiddlewareFn = mw.clone();
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

/// Middleware specific impl
impl App {
    /// Adds a middleware handler to the application request pipeline
    /// 
    /// # Examples
    /// ```no_run
    /// use volga::{App, Results};
    ///
    ///# #[tokio::main]
    ///# async fn main() -> std::io::Result<()> {
    /// let mut app = App::new();
    /// 
    /// app.use_middleware(|ctx, next| async move {
    ///     next(ctx).await
    /// });
    ///# app.run().await
    ///# }
    /// ```
    pub fn use_middleware<F, Fut>(&mut self, middleware: F) -> &mut Self
    where
        F: Fn(HttpContext, Next) -> Fut + Send + Sync + 'static,
        Fut: Future<Output = HttpResult> + Send,
    {
        let middleware = Arc::new(middleware);
        let mw = Arc::new(move |ctx: HttpContext, next: Next| {
            let middleware = middleware.clone(); // cloning for each invocation
            Box::pin(async move {
                // Here, middleware() can be invoked repeatedly because it’s wrapped in an Arc and cloned.
                middleware(ctx, next).await
            }) as BoxFuture<HttpResult>
        });

        let middlewares = self.pipeline.middlewares_mut();
        middlewares.pipeline.push(mw);
        self
    }

    /// Registers default middleware
    pub(super) fn use_endpoints(&mut self) {
        if self.pipeline.has_middleware_pipeline() {
            self.use_middleware(|ctx, _| async move {
                ctx.execute().await
            });
        }
    }
}

