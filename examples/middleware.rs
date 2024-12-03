use volga::{App, Router, Middleware, ok, status, CancellationToken};
use volga::headers::{Header, Accept};

#[tokio::main]
#[allow(clippy::all)]
async fn main() -> std::io::Result<()> {
    // Start the server
    let mut app = App::new();

    // Example of middleware
    app.use_middleware(|ctx, next| async move {
        let cancellation_token: CancellationToken = ctx.extract()?;
        let user_agent: Header<Accept> = ctx.extract()?;
        
        if !cancellation_token.is_cancelled() && *user_agent == "*/*" {
            next(ctx).await
        } else { 
            status!(406)
        }
    });

    // Request handler
    app.map_get("/hello", || async {
        ok!("Hello World!")
    });

    app.run().await
}