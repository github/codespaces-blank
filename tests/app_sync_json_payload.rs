use serde::{Deserialize, Serialize};
use volga::{App, Results, SyncEndpointsMapping, ok};

#[derive(Deserialize, Serialize)]
struct User {
    name: String,
    age: u32
}

//#[tokio::test]
//async fn it_reads_json_payload() {
//    tokio::spawn(async {
//        let mut app = App::build("127.0.0.1:7891").await?;
//
//        app.map_post("/test", |req| {
//            let user: User = tokio::runtime::Runtime::new().unwrap().block_on(req.payload())?;
//            let response = format!("My name is: {}, I'm {} years old", user.name, user.age);
//
//            Results::text(&response)
//        });
//
//        app.run().await
//    });
//
//    let response = tokio::spawn(async {
//        let user = User { name: String::from("John"), age: 35 };
//        let client = reqwest::Client::new();
//        client.post("http://127.0.0.1:7891/test").json(&user).send().await
//    }).await.unwrap().unwrap();
//
//    assert!(response.status().is_success());
//    assert_eq!(response.text().await.unwrap(), "My name is: John, I'm 35 years old");
//}

#[tokio::test]
async fn it_writes_json_response() {
    tokio::spawn(async {
        let mut app = App::build("127.0.0.1:7892").await?;

        app.map_get("/test", |_req| {
            let user = User { name: String::from("John"), age: 35 };

            Results::json(&user)
        });

        app.run().await
    });

    let response = tokio::spawn(async {
        let client = reqwest::Client::new();
        client.get("http://127.0.0.1:7892/test").send().await.unwrap().json::<User>().await
    }).await.unwrap().unwrap();

    assert_eq!(response.name, "John");
    assert_eq!(response.age, 35);
}

#[tokio::test]
async fn it_writes_json_using_macro_response() {
    tokio::spawn(async {
        let mut app = App::build("127.0.0.1:7895").await?;

        app.map_get("/test", |_req| {
            let user = User { name: String::from("John"), age: 35 };

            ok!(&user)
        });

        app.run().await
    });

    let response = tokio::spawn(async {
        let client = reqwest::Client::new();
        client.get("http://127.0.0.1:7895/test").send().await.unwrap().json::<User>().await
    }).await.unwrap().unwrap();

    assert_eq!(response.name, "John");
    assert_eq!(response.age, 35);
}

#[tokio::test]
async fn it_writes_untyped_json_response() {
    tokio::spawn(async {
        let mut app = App::build("127.0.0.1:7896").await?;

        app.map_get("/test", |_req| {
            ok!({ "name": "John", "age": 35 })
        });

        app.run().await
    });

    let response = tokio::spawn(async {
        let client = reqwest::Client::new();
        client.get("http://127.0.0.1:7896/test").send().await.unwrap().json::<User>().await
    }).await.unwrap().unwrap();

    assert_eq!(response.name, "John");
    assert_eq!(response.age, 35);
}