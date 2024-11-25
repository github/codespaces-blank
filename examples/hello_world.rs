use volga::{
    App,
    ok,
    AsyncEndpointsMapping
};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    // Start the server
    let mut app = App::new();

    // Example of asynchronous request handler
    app.map_get("/hello", |_req| async {
        ok!("Hello World!")
    });

    app.run().await
}