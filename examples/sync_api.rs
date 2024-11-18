use volga::{
    App, 
    ok, 
    SyncEndpointsMapping
};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    // Start the server
    let mut app = App::build("127.0.0.1:7878").await?;

    // Example of synchronous request handler
    app.map_get("/hello", |_req| {
        ok!("Hello World!")
    });

    app.run().await
}