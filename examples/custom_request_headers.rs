use volga::{App, Router, ok, Middleware};
use volga::headers::{
    Header,
    custom_headers
};

const CORRELATION_ID_HEADER: &str = "x-correlation-id";

// Custom header
custom_headers! {
    (CorrelationId, CORRELATION_ID_HEADER)
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let mut app = App::new();

    // Setting up the "x-correlation-id" header if it's not provided
    app.use_middleware(|mut ctx, next| async move { 
        if ctx.extract::<Header<CorrelationId>>().is_err() {
            let correlation_id = Header::<CorrelationId>::from_static("123-321-456");
            ctx.insert_header(correlation_id);
        } 
        next(ctx).await
    });
    
    // Reading custom header and insert it to response headers
    app.map_get("/hello", |correlation_id: Header<CorrelationId>| async move {
        let (header, value) = correlation_id.into_string_parts()?;
        ok!([(header, value)])
    });

    app.run().await
}