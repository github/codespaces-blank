use tokio::io;
use tokio_util::sync::CancellationToken;
use std::{
    io::{Error, ErrorKind::InvalidInput},
    future::Future,
    pin::Pin,
    sync::Arc
};
use hyper::{
    Request,
    body::Incoming,
    service::Service
};
use crate::{
    app::Pipeline, 
    HttpResponse, 
    Results, 
    HttpResult
};

#[cfg(feature = "middleware")]
use crate::HttpContext;

#[derive(Clone)]
pub(super) struct Scope {
    pub(super) pipeline: Arc<Pipeline>,
    pub(super) cancellation_token: CancellationToken
}

impl Service<Request<Incoming>> for Scope {
    type Response = HttpResponse;
    type Error = Error;
    type Future = Pin<Box<dyn Future<Output = Result<Self::Response, Self::Error>> + Send>>;

    fn call(&self, request: Request<Incoming>) -> Self::Future { 
        Box::pin(Self::handle_request(request, self.pipeline.clone(), self.cancellation_token.clone()))
    }
}

impl Scope {
    pub(super) fn new(pipeline: Arc<Pipeline>) -> Self {
        Self { 
            cancellation_token: CancellationToken::new(),
            pipeline
        }
    }
    
    pub(super) async fn handle_request(mut request: Request<Incoming>, pipeline: Arc<Pipeline>, cancellation_token: CancellationToken) -> io::Result<HttpResponse> {
        if let Some(endpoint_context) = pipeline.endpoints().get_endpoint(&request).await {
            let (handler, params) = endpoint_context.into_parts();
            
            let extensions = request.extensions_mut();
            extensions.insert(cancellation_token);

            if !params.is_empty() {
                extensions.insert(params);
            }
            
            let response: HttpResult;
            #[cfg(feature = "middleware")]
            {
                response = if pipeline.has_middleware_pipeline() {
                    let ctx = HttpContext::new(request, handler);
                    pipeline.execute(ctx).await
                } else {
                    handler.call(request).await
                };
            }
            #[cfg(not(feature = "middleware"))]
            {
                response = handler.call(request).await;
            }

            match response {
                Ok(response) => Ok(response),
                Err(error) if error.kind() == InvalidInput => Results::bad_request(Some(error.to_string())),
                Err(error) => Results::internal_server_error(Some(error.to_string()))
            }
        } else {
            Results::not_found()
        }
    }
}