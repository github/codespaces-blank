use volga::{App, Router, Middleware, ok, status};

#[tokio::main]
#[allow(clippy::all)]
async fn main() -> std::io::Result<()> {
    // Start the server
    let mut app = App::new();

    // Example of middleware
    app.use_middleware(|ctx, next| async move {
        if ctx.request.headers().contains_key("user-agent") {
            next(ctx).await
        } else { 
            status!(404)
        }
    });

    // Request handler
    app.map_get("/hello", || async {
        ok!("Hello World!")
    });

    app.run().await
}