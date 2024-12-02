use volga::{
    App,
    Router,
    ok,
    headers,
    Headers,
    Results,
    ResponseContext
};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let mut app = App::new();

    // Read request headers
    app.map_get("/hi", |headers: Headers|async move { 
        let request_headers = headers.into_inner();
        let api_key = request_headers.get("x-api-key").unwrap();
        
        ok!(api_key.to_str().unwrap())
    });
    
    // Respond with headers
    app.map_get("/hello", || async {
        ok!("Hello World!", [
           ("x-api-key", "some api key"),
           ("Content-Type", "text/plain")
       ])
    });

    // Respond with headers using headers! macro
    app.map_get("/hello-again", || async {
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