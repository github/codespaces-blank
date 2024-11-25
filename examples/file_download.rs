use tokio::fs::File;
use volga::{
    App,
    file,
    AsyncEndpointsMapping
};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let mut app = App::new();
    
    app.map_get("/download", |_req| async {
        let file = File::open("examples/files/download.txt").await?;

        file!("download.txt", file)
    });
    
    app.run().await
}