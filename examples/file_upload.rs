use volga::{
    App,
    ok,
    AsyncEndpointsMapping,
    File
};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let mut app = App::build("127.0.0.1:7878").await?;

    app.map_post("/upload", |req| async move {
        req.to_file("examples/files/upload_test.txt").await?;

        ok!()
    });

    app.run().await
}