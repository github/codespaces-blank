use std::future::Future;
use serde::de::DeserializeOwned;

#[cfg(feature = "async")]
pub trait Payload {
    /// Returns a request body deserialized to type of `T`
    /// 
    /// > This method is only available with async feature
    /// 
    /// # Example
    /// ```no_run
    ///use volga::{App, AsyncEndpointsMapping, Results, Payload};
    ///use serde::Deserialize;
    /// 
    ///#[derive(Deserialize)]
    ///struct User {
    ///    name: String,
    ///    age: i32
    ///}
    ///
    ///#[tokio::main]
    ///async fn main() -> std::io::Result<()> {
    ///    let mut app = App::build("127.0.0.1:7878").await?;
    ///
    ///    // POST /test
    ///    // { name: "John", age: 35 }
    ///    app.map_post("/test", |req| async move {
    ///        let params: User = req.payload().await?;
    ///
    ///        Results::text("Pass!")
    ///    });
    ///
    ///    app.run().await
    ///}
    /// ```
    fn payload<T: DeserializeOwned>(self) -> impl Future<Output = Result<T, std::io::Error>>;
}

#[cfg(feature = "sync")]
pub trait SyncPayload {
    /// Returns a request body deserialized to type of `T`
    /// 
    /// > This method is only available with sync feature
    /// 
    /// # Example
    /// ```no_run
    ///use volga::{App, SyncEndpointsMapping, Results, SyncPayload};
    ///use serde::Deserialize;
    /// 
    ///#[derive(Deserialize)]
    ///struct User {
    ///    name: String,
    ///    age: i32
    ///}
    ///
    ///#[tokio::main]
    ///async fn main() -> std::io::Result<()> {
    ///    let mut app = App::build("127.0.0.1:7878").await?;
    ///
    ///    // POST /test
    ///    // { name: "John", age: 35 }
    ///    app.map_post("/test", |req| move {
    ///        let params: User = req.payload()?;
    ///
    ///        Results::text("Pass!")
    ///    });
    ///
    ///    app.run().await
    ///}
    /// ```
    fn payload<T: DeserializeOwned>(self) -> Result<T, std::io::Error>;
}