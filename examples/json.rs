use serde::{Deserialize, Serialize};
use volga::{App, ok, AsyncEndpointsMapping, Payload, Params};

#[derive(Deserialize)]
#[derive(Serialize)]
#[derive(Debug)]
struct User {
    name: String,
    age: i32
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let mut app = App::build("127.0.0.1:7878").await?;

    // Return untyped JSON
    // GET /health
    app.map_get("/health", |_req| async {
        ok!({ "status": "healthy" }) // { status: "healthy" }
    });
    
    // Return strongly typed JSON
    // GET /user/John
    app.map_get("/user/{name}", |req| async move {
        let name: String = req.param("name")?; 
        let user: User = User {
            name,
            age: 35
        };

        ok!(&user) // { name: "John", age: 35 }
    });
    
    // Read JSON body
    // POST /user
    // { name: "John", age: 35 }
    app.map_post("/user", |req| async move {
        let user: User = req.payload().await?;

        ok!("User payload: {:?}", user)
    });

    app.run().await
}