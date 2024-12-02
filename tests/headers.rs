use volga::{
    App, Router, Headers, Header,
    headers::extract::ContentType, ok
};

#[tokio::test]
async fn it_reads_headers() {
    tokio::spawn(async {
        let mut app = App::new().bind("127.0.0.1:7900");

        app.map_get("/test", |headers: Headers| async move {
            ok!("{}", headers.get("x-api-key").unwrap().to_str().unwrap())
        });

        app.run().await
    });

    let response = tokio::spawn(async {
        let client = if cfg!(all(feature = "http1", not(feature = "http2"))) {
            reqwest::Client::builder().http1_only().build().unwrap()
        } else {
            reqwest::Client::builder().http2_prior_knowledge().build().unwrap()
        };
        client.get("http://127.0.0.1:7900/test").header("x-api-key", "some-api-key").send().await
    }).await.unwrap().unwrap();

    assert!(response.status().is_success());
    assert_eq!(response.text().await.unwrap(), "\"some-api-key\"");
}

#[tokio::test]
async fn it_reads_specific_header() {
    tokio::spawn(async {
        let mut app = App::new().bind("127.0.0.1:7901");

        app.map_get("/test", |content_type: Header<ContentType>| async move {
            ok!("{}", content_type)
        });

        app.run().await
    });

    let response = tokio::spawn(async {
        let client = if cfg!(all(feature = "http1", not(feature = "http2"))) {
            reqwest::Client::builder().http1_only().build().unwrap()
        } else {
            reqwest::Client::builder().http2_prior_knowledge().build().unwrap()
        };
        client.get("http://127.0.0.1:7901/test").header("Content-Type", "text/plain").send().await
    }).await.unwrap().unwrap();

    assert!(response.status().is_success());
    assert_eq!(response.text().await.unwrap(), "\"text/plain\"");
}

#[tokio::test]
async fn it_writes_headers() {
    tokio::spawn(async {
        let mut app = App::new().bind("127.0.0.1:7902");

        app.map_get("/test", || async move {
            ok!("ok!", [
                ("x-api-key", "some-api-key")
            ])
        });

        app.run().await
    });

    let response = tokio::spawn(async {
        let client = if cfg!(all(feature = "http1", not(feature = "http2"))) {
            reqwest::Client::builder().http1_only().build().unwrap()
        } else {
            reqwest::Client::builder().http2_prior_knowledge().build().unwrap()
        };
        client.get("http://127.0.0.1:7902/test").send().await
    }).await.unwrap().unwrap();

    assert!(response.status().is_success());
    assert_eq!(response.headers().get("x-api-key").unwrap(), "some-api-key");
    assert_eq!(response.text().await.unwrap(), "\"ok!\"");
}