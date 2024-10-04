use volga::{App, AsyncMiddlewareMapping};

#[tokio::test]
async fn it_adds_middleware_request() {
    if let Ok(mut app) = App::build("127.0.0.1:7884").await {
        app.use_middleware(|context, next| async move {
            next(context).await
        }).await;

        assert!(true);
    } else {
        panic!("Unable to build the server!");
    }
}