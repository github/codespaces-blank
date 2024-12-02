use volga::{
    App, 
    Router, 
    Middleware,
    ok, 
};

#[tokio::main]
#[allow(clippy::all)]
async fn main() -> std::io::Result<()> {
    // Start the server
    let mut app = App::new();

    // Middleware 1
    app.use_middleware(|ctx, next| async move {
        // Something can be done before the middleware 2
        println!("Before Middleware 2");

        let response = next(ctx).await;

        // Something can be done after the next middleware 2 is completed
        println!("After Middleware 2");

        response
    });

    // Middleware 2
    app.use_middleware(|ctx, next| async move {
        // Something can be done before the next request handler
        println!("Before request handler");

        let response = next(ctx).await;

        // Something can be done after the request handler is completed
        println!("After request handler");

        response
    });

    // Request handler
    app.map_get("/hello", || async {
        ok!("Hello World!")
    });

    app.run().await
}