use volga::{App, Router, ok};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let mut app = App::new();

    // HEAD /hello
    app.map_head("/hello", || async {
        ok!([
            ("x-custom-head", "some-value")
        ])
    });

    // GET /hello
    app.map_get("/hello", || async {
        ok!("Hello World!", [
            ("x-custom-head", "some-value")
        ])
    });

    app.run().await
}