use std::io;
use std::str::FromStr;
use crate::RequestParams;

pub trait Params {
    /// Returns a query or route params of HTTP request
    /// 
    /// # Example
    /// ```no_run
    /// use volga::{App, AsyncEndpointsMapping, ok, Params};
    ///
    /// # #[tokio::main]
    /// # async fn main() -> std::io::Result<()> {
    /// # let mut app = App::build("127.0.0.1:7878").await?;
    /// // GET /test?id=11
    /// app.map_get("/test", |req| async move {
    ///     let params = req.params().unwrap();
    ///     let id = params.get("id").unwrap(); // "11"
    ///
    ///     ok!("ID is: {}", id)
    /// });
    /// # app.run().await
    /// # }
    /// ```
    fn params(&self) -> Option<&RequestParams>;

    /// Returns a query or route param of HTTP request by `name`
    /// and parses it to `T`.
    ///
    /// # Example
    /// ```no_run
    /// use volga::{App, AsyncEndpointsMapping, ok, Params};
    ///
    /// # #[tokio::main]
    /// # async fn main() -> std::io::Result<()> {
    /// # let mut app = App::build("127.0.0.1:7878").await?;
    /// // GET /test?id=11
    /// app.map_get("/test", |req| async move {
    ///     let id: i32 = req.param("id")?; // 11
    ///
    ///     ok!("ID is: {}", id)
    /// });
    /// # app.run().await
    /// # }
    /// ```
    fn param<T: FromStr>(&self, name: &str) -> Result<T, io::Error>;

    /// Returns a query or route param of HTTP request by `name`
    ///
    /// # Example
    /// ```no_run
    /// use volga::{App, AsyncEndpointsMapping, ok, Params};
    ///
    /// # #[tokio::main]
    /// # async fn main() -> std::io::Result<()> {
    /// # let mut app = App::build("127.0.0.1:7878").await?;
    /// // GET /test?id=11
    /// app.map_get("/test", |req| async move {
    ///     let id = req.param_str("id")?; // "11"
    ///
    ///     ok!("ID is: {}", id)
    /// });
    /// # app.run().await
    /// # }
    /// ```
    fn param_str(&self, name: &str) -> Result<&str, io::Error>;
}