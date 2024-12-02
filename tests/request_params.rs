use std::collections::HashMap;
use serde::Deserialize;
use volga::{App, Results, Router, Query};

#[derive(Deserialize)]
struct User {
    name: String,
    age: u32
}

#[tokio::test]
async fn it_reads_route_params() {
    tokio::spawn(async {
        let mut app = App::new().bind("127.0.0.1:7887");

        app.map_get("/test/{name}/{age}", |name: String, age: u32| async move {
            let response = format!("My name is: {}, I'm {} years old", name, age);

            Results::text(&response)
        });

        app.run().await
    });

    let response = tokio::spawn(async {
        let client = if cfg!(all(feature = "http1", not(feature = "http2"))) {
            reqwest::Client::builder().http1_only().build().unwrap()
        } else {
            reqwest::Client::builder().http2_prior_knowledge().build().unwrap()
        };
        client.get("http://127.0.0.1:7887/test/John/35").send().await
    }).await.unwrap().unwrap();

    assert!(response.status().is_success());
    assert_eq!(response.text().await.unwrap(), "My name is: John, I'm 35 years old");
}

#[tokio::test]
async fn it_reads_query_params() {
    tokio::spawn(async {
        let mut app = App::new().bind("127.0.0.1:7888");

        app.map_get("/test", |user: Query<User>| async move {
            let response = format!("My name is: {}, I'm {} years old", user.name, user.age);

            Results::text(&response)
        });

        app.run().await
    });

    let response = tokio::spawn(async {
        let client = if cfg!(all(feature = "http1", not(feature = "http2"))) {
            reqwest::Client::builder().http1_only().build().unwrap()
        } else {
            reqwest::Client::builder().http2_prior_knowledge().build().unwrap()
        };
        client.get("http://127.0.0.1:7888/test?name=John&age=35").send().await
    }).await.unwrap().unwrap();

    assert!(response.status().is_success());
    assert_eq!(response.text().await.unwrap(), "My name is: John, I'm 35 years old");
}

#[tokio::test]
async fn it_reads_query_as_hash_map_params() {
    tokio::spawn(async {
        let mut app = App::new().bind("127.0.0.1:7898");

        app.map_get("/test", |query: Query<HashMap<String, String>>| async move {
            let name = query.get("name").unwrap();
            let age = query.get("age").unwrap();
            let response = format!("My name is: {}, I'm {} years old", name, age);

            Results::text(&response)
        });

        app.run().await
    });

    let response = tokio::spawn(async {
        let client = if cfg!(all(feature = "http1", not(feature = "http2"))) {
            reqwest::Client::builder().http1_only().build().unwrap()
        } else {
            reqwest::Client::builder().http2_prior_knowledge().build().unwrap()
        };
        client.get("http://127.0.0.1:7898/test?name=John&age=35").send().await
    }).await.unwrap().unwrap();

    assert!(response.status().is_success());
    assert_eq!(response.text().await.unwrap(), "My name is: John, I'm 35 years old");
}