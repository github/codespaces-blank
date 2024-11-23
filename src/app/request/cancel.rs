use tokio_util::sync::CancellationToken;

pub trait Cancel {
    /// Creates a clone of the `CancellationToken` attached to the HTTP request which will get cancelled whenever the current token gets cancelled, and vice versa.
    /// 
    ///# Example
    /// ```no_run
    /// use volga::{App, AsyncEndpointsMapping, ok, Cancel};
    /// 
    /// # #[tokio::main]
    /// # async fn main() -> std::io::Result<()> {
    /// # let mut app = App::build("127.0.0.1:7878").await?;
    /// app.map_get("/test", |req| async move {
    ///     let token = req.cancellation_token();
    /// 
    ///     if token.is_cancelled() { 
    ///         ok!("Cancelled!")
    ///     } else {
    ///         ok!("Pass!")
    ///     } 
    /// });
    /// # app.run().await
    /// # }
    /// ```
    fn cancellation_token(&self) -> CancellationToken;
}