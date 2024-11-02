use volga::{App, file, SyncEndpointsMapping};

#[tokio::test]
async fn it_writes_file_response() {
    tokio::spawn(async {
        let mut app = App::build("127.0.0.1:7898").await?;

        app.map_get("/test", |_req| {
            let file_name = "example.txt";
            let file_data = b"Hello, this is some file content!".to_vec();

            file!(file_name, file_data)
        });

        app.run().await
    });

    let response = tokio::spawn(async {
        let client = reqwest::Client::new();
        client.get("http://127.0.0.1:7898/test").send().await.unwrap().bytes().await
    }).await.unwrap().unwrap();

    let content = String::from_utf8_lossy(&response);

    assert_eq!(content, "Hello, this is some file content!");
    assert_eq!(content.len(), 33);
}