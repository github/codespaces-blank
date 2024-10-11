use volga::{App, Results, SyncEndpointsMapping};

#[tokio::test]
async fn it_maps_to_get_request() {
    if let Ok(mut app) = App::build("127.0.0.1:7879").await {
        app.map_get("/test", |_req| {
            Results::text("Pass!")
        }).await;
    } else {
        panic!("Unable to build the server!");
    }
}

#[tokio::test]
async fn it_maps_to_post_request() {
    if let Ok(mut app) = App::build("127.0.0.1:7880").await {
        app.map_post("/test", |_req| {
            Results::text("Pass!")
        }).await;
    } else {
        panic!("Unable to build the server!");
    }
}

#[tokio::test]
async fn it_maps_to_put_request() {
    if let Ok(mut app) = App::build("127.0.0.1:7881").await {
        app.map_put("/test", |_req| {
            Results::text("Pass!")
        }).await;
    } else {
        panic!("Unable to build the server!");
    }
}

#[tokio::test]
async fn it_maps_to_patch_request() {
    if let Ok(mut app) = App::build("127.0.0.1:7882").await {
        app.map_patch("/test", |_req| {
            Results::text("Pass!")
        }).await;
    } else {
        panic!("Unable to build the server!");
    }
}

#[tokio::test]
async fn it_maps_to_delete_request() {
    if let Ok(mut app) = App::build("127.0.0.1:7883").await {
        app.map_delete("/test", |_req| {
            Results::text("Pass!")
        }).await;
    } else {
        panic!("Unable to build the server!");
    }
}