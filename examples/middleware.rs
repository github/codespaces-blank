use volga::{
    App, 
    ok, 
    AsyncEndpointsMapping, 
    AsyncMiddlewareMapping
};

#[tokio::main]
#[allow(clippy::all)]
async fn main() -> std::io::Result<()> {
    // Start the server
    let mut app = App::new();

    // Middleware 1
    app.use_middleware(|ctx, next| async move {
        // Something can be done before the middleware 2

        let response = next(ctx).await;

        // Something can be done after the next middleware 2 is completed

        response
    });

    // Middleware 2
    app.use_middleware(|ctx, next| async move {
        // Something can be done before the next request handler

        let response = next(ctx).await;

        // Something can be done after the request handler is completed

        response
    });

    // Request handler
    app.map_get("/hello", |_req| async {
        ok!("Hello World!")
    });

    app.run().await
}