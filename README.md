# Volga
Fast & Easy Web Framework for Rust based on [Tokio](https://tokio.rs/) runtime for fun and painless microservices crafting.

[![latest](https://github.com/RomanEmreis/volga/actions/workflows/rust.yml/badge.svg)](https://github.com/RomanEmreis/volga/actions/workflows/rust.yml)

## Getting Started

### Asynchronous handler:
```rust
use volga::{App, Results, AsyncEndpointsMapping};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    // Start the server
    let mut server = App::build("127.0.0.1:7878").await?;

    // Example of asynchronous request handler
    server.map_get("/hello", |request| async {
        Results::text("Hello World!")
    }).await;
    
    server.run().await?;
    
    Ok(())
}
```
### Synchronous handler:
```rust
use volga::{App, Results, SyncEndpointsMapping};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    // Start the server
    let mut server = App::build("127.0.0.1:7878").await?;
    
    // Example of synchronous request handler
    server.map_get("/hello", |request| {
        Results::text("Hello World!")
    }).await;
    
    server.run().await?;
    
    Ok(())
}
```
### Custom middleware:
```rust
use volga::{App, Results, AsyncEndpointsMapping, AsyncMiddlewareMapping};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    // Start the server
    let mut server = App::build("127.0.0.1:7878").await?;

    // Example of middleware
    server.use_middleware(|context, next| async move {
        // Something can be done before the next middleware

        let response = next(context).await;

        // Something can be done after the next middleware is completed

        response
    }).await;
    
    // Example of asynchronous request handler
    server.map_get("/hello", |request| async {
        Results::text("Hello World!")
    }).await;
    
    server.run().await?;
    
    Ok(())
}
```
### Reading query parameters
```rust
use volga::{App, AsyncEndpointsMapping, Results, Params};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let mut app = App::build("127.0.0.1:7878").await?;

    // GET /test?id=11
    app.map_get("/test", |req| async move {
        let params = req.params().unwrap();
        let id = params.get("id").unwrap(); // "11"

        Results::text("Pass!")
    }).await;

    Ok(())
}
```
### Reading JSON payload
```rust
use volga::{App, AsyncEndpointsMapping, Results, Payload};
use serde::Deserialize;
 
#[derive(Deserialize)]
struct User {
    name: String,
    age: i32
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let mut app = App::build("127.0.0.1:7878").await?;

    // POST /test
    // { name: "John", age: 35 }
    app.map_post("/test", |req| async move {
        let params: User = req.payload().unwrap();

        Results::text("Pass!")
    }).await;

    Ok(())
}
```
### Returning a JSON
```rust
use volga::{App, AsyncEndpointsMapping, Results, Payload};
use serde::Serialize;
 
#[derive(Serialize)]
struct User {
    name: String,
    age: i32
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let mut app = App::build("127.0.0.1:7878").await?;

    app.map_get("/test", |req| async move {
        let user: User = User {
            name: "John",
            age: 35
        };

        Results::json(&user) // { name: "John", age: 35 }
    }).await;

    Ok(())
}
```

