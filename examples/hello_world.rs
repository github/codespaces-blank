use volga::{App, ok};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    // Start the server
    let mut app = App::new();

    // Example of asynchronous request handler
    app.map_get("/hello", || async {
        ok!("Hello World!")
    });

    app.run().await
}