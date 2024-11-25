use volga::{
    App, 
    ok, 
    SyncEndpointsMapping
};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    // Start the server
    let mut app = App::new();

    // Example of synchronous request handler
    app.map_get("/hello", |_req| {
        ok!("Hello World!")
    });

    app.run().await
}