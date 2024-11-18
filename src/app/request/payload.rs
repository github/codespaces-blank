use std::future::Future;
use serde::de::DeserializeOwned;

pub trait Payload {
    /// Returns a request body deserialized to type of `T`
    /// 
    /// > This method is only available in async context
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