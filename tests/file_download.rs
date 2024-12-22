use volga::{App, file};
use tokio::fs::File;

#[tokio::test]
async fn it_writes_file_response() {
    tokio::spawn(async {
        let mut app = App::new().bind("127.0.0.1:7897");

        app.map_get("/download", || async move {
            let file_name = "tests/resources/test_file.txt";
            let file = File::open(file_name).await?;

            file!("test_file.txt", file)
        });

        app.run().await
    });

    let response = tokio::spawn(async {
        let client = if cfg!(all(feature = "http1", not(feature = "http2"))) {
            reqwest::Client::builder().http1_only().build().unwrap()
        } else {
            reqwest::Client::builder().http2_prior_knowledge().build().unwrap()
        };
        client.get("http://127.0.0.1:7897/download").send().await.unwrap().bytes().await.unwrap()
    }).await.unwrap();

    let mut bytes = response.to_vec();
    // If the file starts with a UTF-8 BOM (EF BB BF), remove it
    if bytes.starts_with(&[0xEF, 0xBB, 0xBF]) {
        bytes.drain(0..3); // This removes the first three bytes
    }
    
    let content = String::from_utf8_lossy(&bytes);
    
    assert_eq!(content, "Hello, this is some file content!");
    assert_eq!(content.len(), 33);
}
