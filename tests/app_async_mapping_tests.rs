use volga::{App, Results, AsyncEndpointsMapping};

#[tokio::test]
async fn it_maps_to_get_request() {
    tokio::spawn(async {
        let mut app = App::build("127.0.0.1:7877").await?;
        app.map_get("/test", |_req| async {
            Results::text("Pass!")
        }).await;
       app.run().await
    });

    let response = tokio::spawn(async {
        reqwest::get("http://127.0.0.1:7877/test").await
    }).await.unwrap().unwrap();

    assert!(response.status().is_success());
    assert_eq!(response.text().await.unwrap(), "Pass!");
}

#[tokio::test]
async fn it_maps_to_post_request() {
    tokio::spawn(async {
        let mut app = App::build("127.0.0.1:7876").await?;
        app.map_post("/test", |_req| async {
            Results::text("Pass!")
        }).await;
       app.run().await
    });

    let response = tokio::spawn(async {
        let client = reqwest::Client::new();
        client.post("http://127.0.0.1:7876/test").send().await
    }).await.unwrap().unwrap();

    assert!(response.status().is_success());
    assert_eq!(response.text().await.unwrap(), "Pass!");
}

#[tokio::test]
async fn it_maps_to_put_request() {
    tokio::spawn(async {
        let mut app = App::build("127.0.0.1:7875").await?;
        app.map_put("/test", |_req| async {
            Results::text("Pass!")
        }).await;
       app.run().await
    });

    let response = tokio::spawn(async {
        let client = reqwest::Client::new();
        client.put("http://127.0.0.1:7875/test").send().await
    }).await.unwrap().unwrap();

    assert!(response.status().is_success());
    assert_eq!(response.text().await.unwrap(), "Pass!");
}

#[tokio::test]
async fn it_maps_to_patch_request() {
    tokio::spawn(async {
        let mut app = App::build("127.0.0.1:7874").await?;
        app.map_patch("/test", |_req| async {
            Results::text("Pass!")
        }).await;
       app.run().await
    });

    let response = tokio::spawn(async {
        let client = reqwest::Client::new();
        client.patch("http://127.0.0.1:7874/test").send().await
    }).await.unwrap().unwrap();

    assert!(response.status().is_success());
    assert_eq!(response.text().await.unwrap(), "Pass!");
}

#[tokio::test]
async fn it_maps_to_delete_request() {
    tokio::spawn(async {
        let mut app = App::build("127.0.0.1:7873").await?;
        app.map_delete("/test", |_req| async {
            Results::text("Pass!")
        }).await;
       app.run().await
    });

    let response = tokio::spawn(async {
        let client = reqwest::Client::new();
        client.delete("http://127.0.0.1:7873/test").send().await
    }).await.unwrap().unwrap();

    assert!(response.status().is_success());
    assert_eq!(response.text().await.unwrap(), "Pass!");
}