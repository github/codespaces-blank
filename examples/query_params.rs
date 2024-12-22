use std::collections::HashMap;
use serde::Deserialize;
use volga::{App, Query, ok, status};

#[derive(Deserialize)]
struct User {
    name: String
}

#[derive(Deserialize)]
struct OptionalUser {
    name: Option<String>
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let mut app = App::new();

    // GET /hello?name=John
    app.map_get("/hello", |user: Query<User>| async move {
        ok!("Hello {}!", user.name)
    });

    // GET /hello-optional
    app.map_get("/hello-optional", |user: Query<OptionalUser>| async move {
        match &user.name { 
            Some(name) => ok!("Hello {}!", name),
            None => status!(400, "Missing query params")
        }
    });

    // GET /hello-again?name=John
    app.map_get("/hello-again", |query: Query<HashMap<String, String>>| async move {
        let name = query.get("name").unwrap(); // "John"

        ok!("Hello {}!", name)
    });

    app.run().await
}