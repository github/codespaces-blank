use crate::http::endpoints::Endpoints;

#[cfg(feature = "middleware")]
use crate::{
    middleware::{Middlewares, HttpContext, Next},
    HttpResult
};

pub(crate) struct PipelineBuilder {
    #[cfg(feature = "middleware")]
    middlewares: Middlewares,
    endpoints: Endpoints
}

pub(crate) struct Pipeline {
    #[cfg(feature = "middleware")]
    start: Option<Next>,
    endpoints: Endpoints
}

impl PipelineBuilder {
    #[cfg(feature = "middleware")]
    pub(super) fn new() -> Self {
        Self {
            middlewares: Middlewares::new(),
            endpoints: Endpoints::new()
        }
    }

    #[cfg(not(feature = "middleware"))]
    pub(super) fn new() -> Self {
        Self { endpoints: Endpoints::new() }
    }

    #[cfg(feature = "middleware")]
    pub(super) fn build(self) -> Pipeline {
        let start = self.middlewares.compose();
        Pipeline {
            endpoints: self.endpoints,
            start
        }
    }

    #[cfg(not(feature = "middleware"))]
    pub(super) fn build(self) -> Pipeline {
        Pipeline { endpoints: self.endpoints }
    }

    #[cfg(feature = "middleware")]
    pub(crate) fn has_middleware_pipeline(&self) -> bool {
        !self.middlewares.is_empty()
    }

    #[cfg(feature = "middleware")]
    pub(crate) fn middlewares_mut(&mut self) -> &mut Middlewares {
        &mut self.middlewares
    }

    pub(super) fn endpoints_mut(&mut self) -> &mut Endpoints {
        &mut self.endpoints
    }
}

impl Pipeline {
    #[inline]
    pub(crate) fn endpoints(&self) -> &Endpoints {
        &self.endpoints
    }
    
    #[cfg(feature = "middleware")]
    pub(crate) fn has_middleware_pipeline(&self) -> bool {
        self.start.is_some()
    }

    #[cfg(feature = "middleware")]
    pub(crate) async fn execute(&self, ctx: HttpContext) -> HttpResult {
        let next = &self.start;
        if let Some(next) = next {
            let next: Next = next.clone();
            next(ctx).await
        } else {
            ctx.execute().await
        }
    }
}
