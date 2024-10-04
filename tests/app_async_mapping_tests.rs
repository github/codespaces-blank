use volga::{App, Results, AsyncEndpointsMapping};

#[tokio::test]
async fn it_maps_to_get_request() {
    if let Ok(mut app) = App::build("127.0.0.1:7878").await {
        app.map_get("/test", |_req| async {
            Results::text("Pass!")
        }).await;

        assert!(true);
    } else {
        panic!("Unable to build the server!");
    }
}

#[tokio::test]
async fn it_maps_to_post_request() {
    if let Ok(mut app) = App::build("127.0.0.1:7877").await {
        app.map_post("/test", |_req| async {
            Results::text("Pass!")
        }).await;

        assert!(true);
    } else {
        panic!("Unable to build the server!");
    }
}

#[tokio::test]
async fn it_maps_to_put_request() {
    if let Ok(mut app) = App::build("127.0.0.1:7876").await {
        app.map_put("/test", |_req| async {
            Results::text("Pass!")
        }).await;

        assert!(true);
    } else {
        panic!("Unable to build the server!");
    }
}

#[tokio::test]
async fn it_maps_to_patch_request() {
    if let Ok(mut app) = App::build("127.0.0.1:7875").await {
        app.map_patch("/test", |_req| async {
            Results::text("Pass!")
        }).await;

        assert!(true);
    } else {
        panic!("Unable to build the server!");
    }
}

#[tokio::test]
async fn it_maps_to_delete_request() {
    if let Ok(mut app) = App::build("127.0.0.1:7874").await {
        app.map_delete("/test", |_req| async {
            Results::text("Pass!")
        }).await;

        assert!(true);
    } else {
        panic!("Unable to build the server!");
    }
}