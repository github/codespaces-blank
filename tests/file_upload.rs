use volga::{App, Router, File, HttpBody, ok};

#[tokio::test]
async fn it_saves_uploaded_file() {
    tokio::spawn(async {
        let mut app = App::new().bind("127.0.0.1:7899");

        app.map_post("/upload", |file: File| async move {
            file.save("tests/resources/test_file_saved.txt").await?;
            ok!()
        });

        app.run().await
    });

    let response = tokio::spawn(async {
        let client = if cfg!(all(feature = "http1", not(feature = "http2"))) {
            reqwest::Client::builder().http1_only().build().unwrap()
        } else {
            reqwest::Client::builder().http2_prior_knowledge().build().unwrap()
        };
        let file = tokio::fs::File::open("tests/resources/test_file.txt").await.unwrap();
        let body = HttpBody::wrap_stream(file);
        
        client.post("http://127.0.0.1:7899/upload").body(reqwest::Body::wrap(body)).send().await.unwrap()
    }).await.unwrap();


    assert!(response.status().is_success());
}