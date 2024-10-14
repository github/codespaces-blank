pub trait Cancel {
    /// Cancels current HTTP request
    /// 
    ///# Example
    /// ```no_run
    ///use volga::{App, AsyncEndpointsMapping, Results, Cancel};
    ///
    ///#[tokio::main]
    ///async fn main() -> std::io::Result<()> {
    ///    let mut app = App::build("127.0.0.1:7878").await?;
    ///
    ///    // GET /test?id=11
    ///    app.map_get("/test", |req| async move {
    ///        req.cancel();
    ///
    ///        Results::text("Pass!")
    ///    }).await;
    ///
    ///    app.run().await
    ///}
    /// ```
    fn cancel(&self);
}