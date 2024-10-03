# Volga
Easy &amp; Fast Web Framework for Rust

## Getting Started

### Asynchronous handler:
```rust
use volga::app::{
    App,
    results::Results,
    endpoints::mapping::asynchronous::AsyncEndpointsMapping
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    // Start the server
    let mut server = App::build("127.0.0.1:7878").await?;

    // Example of asynchronous request handler
    server.map_get("/hello", |request| async move {
        Results::text("Hello World!")
    }).await;
    
    server.run().await?;
    
    Ok(())
}
```
### Synchronous handler:
```rust
use volga::app::{
    App,
    results::Results,
    endpoints::mapping::asynchronous::SyncEndpointsMapping
};

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
use volga::app::{
    App,
    results::Results,
    endpoints::mapping::asynchronous::AsyncEndpointsMapping,
    middleware::mapping::asynchronous::AsyncMiddlewareMapping
};

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
    server.map_get("/hello", |request| async move {
        Results::text("Hello World!")
    }).await;
    
    server.run().await?;
    
    Ok(())
}
```

