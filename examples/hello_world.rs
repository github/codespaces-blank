use volga::{
    App,
    ok,
    AsyncEndpointsMapping
};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    // Start the server
    let mut app = App::build("127.0.0.1:7878").await?;

    // Example of asynchronous request handler
    app.map_get("/hello", |_req| async {
        ok!("Hello World!")
    });

    app.run().await
}