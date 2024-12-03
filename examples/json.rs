use serde::{Deserialize, Serialize};
use volga::{App, ok, Router, Json};

#[derive(Debug, Serialize, Deserialize)]
struct User {
    name: String,
    age: i32
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let mut app = App::new();

    // Return untyped JSON
    // GET /health
    app.map_get("/health", || async {
        ok!({ "status": "healthy" }) // { status: "healthy" }
    });
    
    // Return strongly typed JSON
    // GET /user/John
    app.map_get("/user/{name}", |name: String| async move {
        let user: User = User {
            name,
            age: 35
        };
        ok!(user) // { name: "John", age: 35 }
    });
    
    // Read JSON body
    // POST /user
    // { name: "John", age: 35 }
    app.map_post("/user", |user: Json<User>| async move {
        ok!("User payload: {:?}", user)
    });

    app.run().await
}