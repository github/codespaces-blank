use std::io;
use crate::RequestParams;

pub trait Params {
    /// Returns a query or route params of HTTP request
    /// 
    /// # Example
    /// ```no_run
    ///use volga::{App, AsyncEndpointsMapping, Results, Params};
    ///
    ///#[tokio::main]
    ///async fn main() -> std::io::Result<()> {
    ///    let mut app = App::build("127.0.0.1:7878").await?;
    ///
    ///    // GET /test?id=11
    ///    app.map_get("/test", |req| async move {
    ///        let params = req.params().unwrap();
    ///        let id = params.get("id").unwrap(); // "11"
    ///
    ///        Results::text("Pass!")
    ///    }).await;
    ///
    ///    app.run().await
    ///}
    /// ```
    fn params(&self) -> Option<&RequestParams>;

    /// Returns a query or route param of HTTP request by `name`
    /// 
    /// # Example
    /// ```no_run
    ///use volga::{App, AsyncEndpointsMapping, Results, Params};
    ///
    ///#[tokio::main]
    ///async fn main() -> std::io::Result<()> {
    ///    let mut app = App::build("127.0.0.1:7878").await?;
    ///
    ///    // GET /test?id=11
    ///    app.map_get("/test", |req| async move {
    ///        let id = req.param("id")?; // "11"
    ///
    ///        Results::text("Pass!")
    ///    }).await;
    ///
    ///    app.run().await
    ///}
    /// ```
    fn param(&self, name: &str) -> Result<&String, io::Error>;
}
