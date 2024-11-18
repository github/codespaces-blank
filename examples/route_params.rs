use volga::{
    App, 
    ok, 
    AsyncEndpointsMapping, 
    Params
};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let mut app = App::build("127.0.0.1:7878").await?;

    // GET /hello/John
    app.map_get("/hello/{name}", |req| async move {
        let params = req.params().unwrap();
        let name = params.get("name").unwrap(); // "11"

        ok!("Hello {}!", name)
    });

    // GET /hello-again/John
    app.map_get("/hello-again/{name}", |req| async move {
        let name = req.param("name")?; // "11"

        ok!("Hello {}!", name)
    });

    app.run().await
}