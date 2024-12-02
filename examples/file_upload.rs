use volga::{
    App,
    Router,
    ok,
    File
};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let mut app = App::new();

    app.map_post("/upload", |file: File| async move {
        file.save("examples/files/upload_test.txt").await?;

        ok!()
    });

    app.run().await
}