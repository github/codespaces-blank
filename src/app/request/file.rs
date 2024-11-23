use std::{io::Error,future::Future,path::Path};

#[cfg(feature = "async")]
pub trait File {
    /// Reads the request body as frames stream and saves into file
    /// 
    /// > This method is only available with async feature
    /// 
    /// # Example
    /// ```no_run
    /// use volga::{App, AsyncEndpointsMapping, ok, File};
    /// 
    /// # #[tokio::main]
    /// # async fn main() -> std::io::Result<()> {
    /// # let mut app = App::build("127.0.0.1:7878").await?;
    /// app.map_post("/test", |req| async move {
    ///     req.to_file("file.dat").await?;
    ///
    ///     ok!("Pass!")
    /// });
    /// # app.run().await
    /// # }
    /// ```
    fn to_file(self, file_name: impl AsRef<Path>) -> impl Future<Output = Result<(), Error>>;
}

#[cfg(feature = "sync")]
pub trait SyncFile {
    /// Reads the request body as frames stream and saves into file
    /// 
    /// > This method is only available with sync feature
    /// 
    /// # Example
    /// ```no_run
    /// use volga::{App, SyncEndpointsMapping, ok, SyncFile};
    /// 
    /// # #[tokio::main]
    /// # async fn main() -> std::io::Result<()> {
    /// # let mut app = App::build("127.0.0.1:7878").await?;
    /// app.map_post("/test", |req| move {
    ///     req.to_file("file.dat")?;
    /// 
    ///     ok!("Pass!")
    /// });
    /// # app.run().await
    /// # }
    /// ```
    fn to_file(self, file_name: impl AsRef<Path>) -> Result<(), Error>;
}