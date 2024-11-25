use volga::{
    App,
    ok,
    AsyncEndpointsMapping, 
    Params
};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let mut app = App::new();

    // GET /hello?name=John
    app.map_get("/hello", |req| async move {
        let params = req.params().unwrap();
        let name = params.get("name").unwrap(); // "John"

        ok!("Hello {}!", name)
    });

    // GET /hello-again?name=John
    app.map_get("/hello-again", |req| async move {
        let name = req.param_str("name")?; // "John"

        ok!("Hello {}!", name)
    });

    app.run().await
}