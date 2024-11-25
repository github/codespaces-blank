use volga::{App, AsyncEndpointsMapping, AsyncMiddlewareMapping, Results};

#[tokio::test]
async fn it_adds_middleware_request() {
    tokio::spawn(async {
        let mut app = App::new().bind("127.0.0.1:7884");

        app.use_middleware(|context, next| async move {
            next(context).await
        });
        app.use_middleware(|_, _| async move {
            Results::text("Pass!")
        });

        app.map_get("/test", |_req| async {
            Results::text("Unreachable!")
        });

       app.run().await
    });

    let response = tokio::spawn(async {
        let client = if cfg!(all(feature = "http1", not(feature = "http2"))) {
            reqwest::Client::builder().http1_only().build().unwrap()
        } else {
            reqwest::Client::builder().http2_prior_knowledge().build().unwrap()
        };
        client.get("http://127.0.0.1:7884/test").send().await
    }).await.unwrap().unwrap();

    assert!(response.status().is_success());
    assert_eq!(response.text().await.unwrap(), "Pass!");
}