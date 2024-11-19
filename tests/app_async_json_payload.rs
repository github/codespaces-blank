use serde::{Deserialize, Serialize};
use volga::{App, ok, Results, AsyncEndpointsMapping, Payload};

#[derive(Deserialize, Serialize)]
struct User {
    name: String,
    age: u32
}

#[tokio::test]
async fn it_reads_json_payload() {
    tokio::spawn(async {
        let mut app = App::build("127.0.0.1:7885").await?;

        app.map_post("/test", |req| async move {
            let user: User = req.payload().await?;
            let response = format!("My name is: {}, I'm {} years old", user.name, user.age);
            
            Results::text(&response)
        });

        app.run().await
    });
    
    let response = tokio::spawn(async {
        let user = User { name: String::from("John"), age: 35 };
        let client = if cfg!(all(feature = "http1", not(feature = "http2"))) {
            reqwest::Client::builder().http1_only().build().unwrap()
        } else {
            reqwest::Client::builder().http2_prior_knowledge().build().unwrap()
        };
        client.post("http://127.0.0.1:7885/test").json(&user).send().await
    }).await.unwrap().unwrap();

    assert!(response.status().is_success());
    assert_eq!(response.text().await.unwrap(), "My name is: John, I'm 35 years old");
}

#[tokio::test]
async fn it_writes_json_response() {
    tokio::spawn(async {
        let mut app = App::build("127.0.0.1:7886").await?;

        app.map_get("/test", |_req| async move {
            let user = User { name: String::from("John"), age: 35 };
            
            Results::json(&user)
        });

        app.run().await
    });

    let response = tokio::spawn(async {
        let client = if cfg!(all(feature = "http1", not(feature = "http2"))) {
            reqwest::Client::builder().http1_only().build().unwrap()
        } else {
            reqwest::Client::builder().http2_prior_knowledge().build().unwrap()
        };
        client.get("http://127.0.0.1:7886/test").send().await.unwrap().json::<User>().await
    }).await.unwrap().unwrap();

    assert_eq!(response.name, "John");
    assert_eq!(response.age, 35);
}

#[tokio::test]
async fn it_writes_json_using_macro_response() {
    tokio::spawn(async {
        let mut app = App::build("127.0.0.1:7893").await?;

        app.map_get("/test", |_req| async move {
            let user = User { name: String::from("John"), age: 35 };

            ok!(&user)
        });

        app.run().await
    });

    let response = tokio::spawn(async {
        let client = if cfg!(all(feature = "http1", not(feature = "http2"))) {
            reqwest::Client::builder().http1_only().build().unwrap()
        } else {
            reqwest::Client::builder().http2_prior_knowledge().build().unwrap()
        };
        client.get("http://127.0.0.1:7893/test").send().await.unwrap().json::<User>().await
    }).await.unwrap().unwrap();

    assert_eq!(response.name, "John");
    assert_eq!(response.age, 35);
}

#[tokio::test]
async fn it_writes_untyped_json_response() {
    tokio::spawn(async {
        let mut app = App::build("127.0.0.1:7894").await?;

        app.map_get("/test", |_req| async move {
            ok!({ "name": "John", "age": 35 })
        });

        app.run().await
    });

    let response = tokio::spawn(async {
        let client = if cfg!(all(feature = "http1", not(feature = "http2"))) {
            reqwest::Client::builder().http1_only().build().unwrap()
        } else {
            reqwest::Client::builder().http2_prior_knowledge().build().unwrap()
        };
        client.get("http://127.0.0.1:7894/test").send().await.unwrap().json::<User>().await
    }).await.unwrap().unwrap();

    assert_eq!(response.name, "John");
    assert_eq!(response.age, 35);
}