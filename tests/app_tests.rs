use volga::App;

#[tokio::test]
async fn correct_socket_str_provided_it_builds() {
    let app = App::build("127.0.0.1:7878").await;
    
    assert!(app.is_ok());
}

#[tokio::test]
async fn incorrect_socket_str_provided_it_builds() {
    let app = App::build("").await;

    assert!(app.is_err());
}