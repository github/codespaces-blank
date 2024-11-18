use std::{io::Error,future::Future,path::Path};

pub trait File {
    /// Reads the request body as frames stream and saves into file
    /// 
    /// > This method is only available in async context
    /// 
    /// # Example
    /// ```no_run
    ///use volga::{App, AsyncEndpointsMapping, Results, File};
    ///
    ///#[tokio::main]
    ///async fn main() -> std::io::Result<()> {
    ///    let mut app = App::build("127.0.0.1:7878").await?;
    ///
    ///    app.map_post("/test", |req| async move {
    ///        req.to_file("file.dat").await?;
    ///
    ///        Results::text("Pass!")
    ///    });
    ///
    ///    app.run().await
    ///}
    /// ```
    fn to_file(self, file_name: impl AsRef<Path>) -> impl Future<Output = Result<(), Error>>;
}