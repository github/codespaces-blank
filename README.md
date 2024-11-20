# Volga
Fast, Easy, and very flexible Web Framework for Rust based on [Tokio](https://tokio.rs/) runtime and [hyper](https://hyper.rs/) for fun and painless microservices crafting.

[![latest](https://img.shields.io/badge/latest-0.3.1-blue)](https://crates.io/crates/volga)
[![latest](https://img.shields.io/badge/rustc-1.80+-964B00)](https://crates.io/crates/volga)
[![License: MIT](https://img.shields.io/badge/License-MIT-violet.svg)](https://github.com/RomanEmreis/volga/blob/main/LICENSE)
[![Build](https://github.com/RomanEmreis/volga/actions/workflows/rust.yml/badge.svg)](https://github.com/RomanEmreis/volga/actions/workflows/rust.yml)
[![Release](https://github.com/RomanEmreis/volga/actions/workflows/release.yml/badge.svg)](https://github.com/RomanEmreis/volga/actions/workflows/release.yml)

[Tutorial](https://romanemreis.github.io/volga-docs/) | [API Docs](https://docs.rs/volga/latest/volga/) | [Examples](https://github.com/RomanEmreis/volga/tree/main/examples)

## Features
* Supports HTTP/1 and HTTP/2
* Robust routing
* Custom middlewares
* Full [Tokio](https://tokio.rs/) compatibility
* Runs on stable Rust 1.80+
## Getting Started
### Dependencies
```toml
[dependencies]
volga = "0.3.1"
tokio = "1.41.1"
```
### Simple asynchronous request handler:
```rust
use volga::*;

#[tokio::main]
async fn main() -> std::io::Result<()> {
    // Start the server
    let mut app = App::build("127.0.0.1:7878").await?;

    // Example of asynchronous request handler
    app.map_get("/hello/{name}", |req| async {
        let name = req.param("name")?;
        ok!("Hello {}!", name)
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

