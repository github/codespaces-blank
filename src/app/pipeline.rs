use crate::{
    app::{middlewares::Middlewares,endpoints::Endpoints},
    HttpContext, 
    HttpResult, 
    Next
};

pub(crate) struct PipelineBuilder {
    middlewares: Middlewares,
    endpoints: Endpoints,
}

pub(crate) struct Pipeline {
    endpoints: Endpoints,
    start: Next,
}

impl PipelineBuilder {
    pub(crate) fn new() -> Self {
        Self {
            middlewares: Middlewares::new(),
            endpoints: Endpoints::new()
        }
    }
    
    pub(crate) fn build(self) -> Pipeline {
        let start = self.middlewares.compose();
        Pipeline {
            endpoints: self.endpoints,
            start
        }
    }

    pub(crate) fn middlewares_mut(&mut self) -> &mut Middlewares {
        &mut self.middlewares
    }

    pub(crate) fn endpoints_mut(&mut self) -> &mut Endpoints {
        &mut self.endpoints
    }
}

impl Pipeline {
    #[inline]
    pub(crate) fn endpoints(&self) -> &Endpoints {
        &self.endpoints
    }

    #[inline]
    pub(crate) async fn execute(&self, ctx: HttpContext) -> HttpResult {
        let next = self.start.clone();
        next(ctx).await
    }
}