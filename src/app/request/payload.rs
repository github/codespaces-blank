use std::io;
use serde::Deserialize;

pub trait Payload {
    /// Returns a request body deserialized to type of `T`
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
    ///        let params: User = req.payload().unwrap();
    ///
    ///        Results::text("Pass!")
    ///    }).await;
    ///
    ///    app.run().await
    ///}
    /// ```
    fn payload<'a, T>(&'a self) -> Result<T, io::Error>
    where
        T: Deserialize<'a>;
}