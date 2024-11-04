# Volga
Fast & Easy Web Framework for Rust based on [Tokio](https://tokio.rs/) runtime for fun and painless microservices crafting.

[![latest](https://img.shields.io/badge/latest-0.2.4-blue)](https://crates.io/crates/volga)
[![latest](https://img.shields.io/badge/rustc-1.80+-964B00)](https://crates.io/crates/volga)
[![License: MIT](https://img.shields.io/badge/License-MIT-violet.svg)](https://github.com/RomanEmreis/volga/blob/main/LICENSE)
[![Build](https://github.com/RomanEmreis/volga/actions/workflows/rust.yml/badge.svg)](https://github.com/RomanEmreis/volga/actions/workflows/rust.yml)
[![Release](https://github.com/RomanEmreis/volga/actions/workflows/release.yml/badge.svg)](https://github.com/RomanEmreis/volga/actions/workflows/release.yml)

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
volga = "0.2.4"
tokio = "1.41.0"
```
### Asynchronous handler (Recommended):
```rust
use volga::{App, ok, AsyncEndpointsMapping};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    // Start the server
    let mut app = App::build("127.0.0.1:7878").await?;

    // Example of asynchronous request handler
    app.map_get("/hello", |req| async {
        ok!("Hello World!")
    });
    
    app.run().await
}
```
### Synchronous handler:
```rust
use volga::{App, ok, SyncEndpointsMapping};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    // Start the server
    let mut app = App::build("127.0.0.1:7878").await?;
    
    // Example of synchronous request handler
    app.map_get("/hello", |req| {
        ok!("Hello World!")
    });
    
    app.run().await
}
```
### Custom middleware:
```rust
use volga::{App, ok, AsyncEndpointsMapping, AsyncMiddlewareMapping};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    // Start the server
    let mut app = App::build("127.0.0.1:7878").await?;

    // Example of middleware
    app.use_middleware(|ctx, next| async move {
        // Something can be done before the next middleware

        let response = next(ctx).await;

        // Something can be done after the next middleware is completed

        response
    });
    
    // Example of asynchronous request handler
    app.map_get("/hello", |req| async {
        ok!("Hello World!")
    });
    
    app.run().await
}
```
### Reading query parameters
```rust
use volga::{App, AsyncEndpointsMapping, ok, Params};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let mut app = App::build("127.0.0.1:7878").await?;

    // GET /hello?id=11
    app.map_get("/hello", |req| async move {
        let params = req.params().unwrap();
        let id = params.get("id").unwrap(); // "11"

        ok!("Hello World!")
    });

    // GET /hello-again?id=11
    app.map_get("/hello-again", |req| async move {
        let id = req.param("id")?; // "11"

        ok!("Hello World!")
    });

    app.run().await
}
```
### Reading route parameters
```rust
use volga::{App, AsyncEndpointsMapping, ok, Params};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let mut app = App::build("127.0.0.1:7878").await?;

    // GET /hello/11
    app.map_get("/hello/{id}", |req| async move {
        let params = req.params().unwrap();
        let id = params.get("id").unwrap(); // "11"

        ok!("Hello World!")
    });

    // GET /hello-again/11
    app.map_get("/hello-again/{id}", |req| async move {
        let id = req.param("id")?; // "11"

        ok!("Hello World!")
    });

    app.run().await
}
```
### Reading JSON payload
```rust
use volga::{App, AsyncEndpointsMapping, ok, Payload};
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
        let params: User = req.payload()?;

        ok!("Hello World!")
    });

    app.run().await
}
```
### Returning a JSON
#### Strongly typed JSON
```rust
use volga::{App, AsyncEndpointsMapping, ok, Payload};
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
            name: String::from("John"),
            age: 35
        };

        ok!(&user) // { name: "John", age: 35 }
    });

    app.run().await
}
```
#### Untyped JSON
```rust
use volga::{App, AsyncEndpointsMapping, ok, Payload};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let mut app = App::build("127.0.0.1:7878").await?;

    app.map_get("/hello", |req| async move {
        ok!({ "name": "John", "age": 35 }) // { name: "John", age: 35 }
    });

    app.run().await
}
```
### Custom headers and Content Type
```rust
use volga::{App, ok, AsyncEndpointsMapping};

#[tokio::main]
async fn main() -> std::io::Result<()> {
   let mut app = App::build("127.0.0.1:7878").await?;

   app.map_get("/hello", |req| async move {
       ok!("Hello World!", [
           ("x-api-key", "some api key"),
           ("Content-Type", "text/plain")
       ])
   });

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
    Latency   578.90us  206.77us   5.77ms   79.81%
    Req/Sec   184.72k     9.54k  200.74k    77.00%
  1837693 requests in 10.08s, 206.80MB read
Requests/sec: 182380.80
Transfer/sec:     20.52MB
```

