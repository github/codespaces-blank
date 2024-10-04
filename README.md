# Volga
Fast & Easy Web Framework for Rust based on [Tokio](https://tokio.rs/) runtime for fun and painless microservices crafting.

[![crates.io](https://img.shields.io/badge/crates.io-0.1.5-blue)](https://crates.io/crates/volga)
[![License: MIT](https://img.shields.io/badge/License-MIT-violet.svg)](https://github.com/RomanEmreis/volga/blob/main/LICENSE)
[![Build](https://github.com/RomanEmreis/volga/actions/workflows/rust.yml/badge.svg)](https://github.com/RomanEmreis/volga/actions/workflows/rust.yml)

## Features
* Supports HTTP/1.x
* Robust routing
* Custom middlewares
* Full [Tokio](https://tokio.rs/) compatibility
* Runs on stable Rust 1.80+
## Getting Started
### Dependencies
```
[dependencies]
volga = "0.1.5"
tokio = "1.40.0"
```
### Asynchronous handler (Recommended):
```rust
use volga::{App, Results, AsyncEndpointsMapping};

#[tokio::main]
async fn main() -> tokio::io::Result<()> {
    // Start the server
    let mut server = App::build("127.0.0.1:7878").await?;

    // Example of asynchronous request handler
    server.map_get("/hello", |request| async {
        Results::text("Hello World!")
    }).await;
    
    server.run().await
}
```
### Synchronous handler:
```rust
use volga::{App, Results, SyncEndpointsMapping};

#[tokio::main]
async fn main() -> tokio::io::Result<()> {
    // Start the server
    let mut server = App::build("127.0.0.1:7878").await?;
    
    // Example of synchronous request handler
    server.map_get("/hello", |request| {
        Results::text("Hello World!")
    }).await;
    
    server.run().await
}
```
### Custom middleware:
```rust
use volga::{App, Results, AsyncEndpointsMapping, AsyncMiddlewareMapping};

#[tokio::main]
async fn main() -> tokio::io::Result<()> {
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
    
    server.run().await
}
```
### Reading query parameters
```rust
use volga::{App, AsyncEndpointsMapping, Results, Params};

#[tokio::main]
async fn main() -> tokio::io::Result<()> {
    let mut app = App::build("127.0.0.1:7878").await?;

    // GET /hello?id=11
    app.map_get("/hello", |req| async move {
        let params = req.params().unwrap();
        let id = params.get("id").unwrap(); // "11"

        Results::text("Hello World!")
    }).await;

    app.run().await
}
```
### Reading route parameters
```rust
use volga::{App, AsyncEndpointsMapping, Results, Params};

#[tokio::main]
async fn main() -> tokio::io::Result<()> {
    let mut app = App::build("127.0.0.1:7878").await?;

    // GET /hello/11
    app.map_get("/hello/{id}", |req| async move {
        let params = req.params().unwrap();
        let id = params.get("id").unwrap(); // "11"

        Results::text("Hello World!")
    }).await;

    app.run().await
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
async fn main() -> tokio::io::Result<()> {
    let mut app = App::build("127.0.0.1:7878").await?;

    // POST /hello
    // { name: "John", age: 35 }
    app.map_post("/hello", |req| async move {
        let params: User = req.payload().unwrap();

        Results::text("Hello World!")
    }).await;

    app.run().await
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
async fn main() -> tokio::io::Result<()> {
    let mut app = App::build("127.0.0.1:7878").await?;

    app.map_get("/hello", |req| async move {
        let user: User = User {
            name: "John",
            age: 35
        };

        Results::json(&user) // { name: "John", age: 35 }
    }).await;

    app.run().await
}
```

