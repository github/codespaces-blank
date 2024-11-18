use volga::{
    App,
    ok,
    headers,
    AsyncEndpointsMapping,
    Results,
    ResponseContext
};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let mut app = App::build("127.0.0.1:7878").await?;

    app.map_get("/hello", |_req| async move {
        ok!("Hello World!", [
           ("x-api-key", "some api key"),
           ("Content-Type", "text/plain")
       ])
    });

    app.map_get("/hello-again", |_req| async move {
        let headers = headers![
            ("x-api-key", "some api key"),
            ("Content-Type", "text/plain")
        ];
        
        Results::from(ResponseContext {
            content: "Hello World!",
            status: 200,
            headers
        })
    });

    app.run().await
}