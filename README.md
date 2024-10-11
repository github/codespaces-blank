# Volga
Fast & Easy Web Framework for Rust based on [Tokio](https://tokio.rs/) runtime for fun and painless microservices crafting.

[![latest](https://img.shields.io/badge/latest-0.1.9-blue)](https://crates.io/crates/volga)
[![latest](https://img.shields.io/badge/rustc-1.80+-964B00)](https://crates.io/crates/volga)
[![License: MIT](https://img.shields.io/badge/License-MIT-violet.svg)](https://github.com/RomanEmreis/volga/blob/main/LICENSE)
[![Build](https://github.com/RomanEmreis/volga/actions/workflows/rust.yml/badge.svg)](https://github.com/RomanEmreis/volga/actions/workflows/rust.yml)

[Tutorial](https://romanemreis.github.io/volga-docs/) | [API Docs](https://docs.rs/volga/latest/volga/)

## Features
* Supports HTTP/1.x
* Robust routing
* Custom middlewares
* Full [Tokio](https://tokio.rs/) compatibility
* Runs on stable Rust 1.80+
## Getting Started
### Dependencies
```toml
[dependencies]
volga = "0.1.9"
tokio = "1.40.0"
```
### Asynchronous handler (Recommended):
```rust
use volga::{App, Results, AsyncEndpointsMapping};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    // Start the server
    let mut app = App::build("127.0.0.1:7878").await?;

    // Example of asynchronous request handler
    app.map_get("/hello", |request| async {
        Results::text("Hello World!")
    }).await;
    
    app.run().await
}
```
### Synchronous handler:
```rust
use volga::{App, Results, SyncEndpointsMapping};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    // Start the server
    let mut app = App::build("127.0.0.1:7878").await?;
    
    // Example of synchronous request handler
    app.map_get("/hello", |request| {
        Results::text("Hello World!")
    }).await;
    
    app.run().await
}
```
### Custom middleware:
```rust
use volga::{App, Results, AsyncEndpointsMapping, AsyncMiddlewareMapping};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    // Start the server
    let mut app = App::build("127.0.0.1:7878").await?;

    // Example of middleware
    app.use_middleware(|context, next| async move {
        // Something can be done before the next middleware

        let response = next(context).await;

        // Something can be done after the next middleware is completed

        response
    }).await;
    
    // Example of asynchronous request handler
    app.map_get("/hello", |request| async {
        Results::text("Hello World!")
    }).await;
    
    app.run().await
}
```
### Reading query parameters
```rust
use volga::{App, AsyncEndpointsMapping, Results, Params};

#[tokio::main]
async fn main() -> std::io::Result<()> {
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
async fn main() -> std::io::Result<()> {
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
async fn main() -> std::io::Result<()> {
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
async fn main() -> std::io::Result<()> {
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
### Custom headers and Content-Type
```rust
use volga::{App, AsyncEndpointsMapping, Results, ResponseContext};
use std::collections::HashMap;

#[tokio::main]
async fn main() -> std::io::Result<()> {
   let mut app = App::build("127.0.0.1:7878").await?;

   app.map_get("/hello", |req| async move {
       let mut headers = HashMap::new();

       // Insert a custom header
       headers.insert(String::from("x-api-key"), String::from("some api key"));
       
       Results::from(ResponseContext {
           content: Box::new(String::from("Hello World!")),
           headers: Some(headers),
           content_type: Some(mime::TEXT_PLAIN)
       })
   }).await;

   app.run().await
}
```
## Performance
Tested a single instance on a laptop using 1 thread and 200 connections and under configuration:
```
OS: Arch Linux
CPU: Intel i7-8665U (8) @ 4.800GHz
RAM: 31686MiB
```
### Results
```
Running 10s test @ http://127.0.0.1:7878/hello
  1 threads and 200 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.47ms  206.78us   3.82ms   63.96%
    Req/Sec   136.88k     9.41k  160.43k    66.00%
  1362576 requests in 10.07s, 168.93MB read
Requests/sec: 135335.46
Transfer/sec:     16.78MB
```

