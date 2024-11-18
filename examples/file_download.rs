use tokio::fs::File;
use volga::{
    App,
    file,
    AsyncEndpointsMapping
};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let mut app = App::build("127.0.0.1:7878").await?;
    
    app.map_get("/download", |_req| async {
        let file = File::open("examples/files/download.txt").await?;

        file!("download.txt", file)
    });
    
    app.run().await
}