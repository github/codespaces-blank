use volga::{App, Router, HttpRequest, stream};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let mut app = App::new();

    // Example of TRACE handler
    app.map_trace("/", |req: HttpRequest| async move {
        let boxed_body = req.into_boxed_body();
        stream!(boxed_body, [
            ("content-type", "message/http")
        ])
    });

    app.run().await
}