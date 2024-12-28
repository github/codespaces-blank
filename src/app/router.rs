use hyper::Method;
use crate::{
    App, HttpResult,
    app::endpoints::{
        args::FromRequest,
        handlers::{Func, GenericHandler}
    }
};

/// Routes mapping 
impl App {
    /// Maps a group of request handlers combined by `prefix`
    /// 
    /// # Examples
    /// ```no_run
    /// use volga::{App, Json, ok};
    ///# #[derive(serde::Deserialize, serde::Serialize)]
    ///# struct User;
    ///# #[tokio::main]
    ///# async fn main() -> std::io::Result<()> {
    /// let mut app = App::new();
    /// 
    /// app.map_group("/user")
    ///     .map_get("/{id}", |id: i32| async move {
    ///         // get the user from somewhere
    ///         let user: User = get_user();
    ///         ok!(user)
    ///     })
    ///     .map_post("/create", |user: Json<User>| async move {
    ///         // create a user somewhere
    ///         let user_id = create_user(user);
    ///         ok!(user_id)
    ///     });
    ///# app.run().await
    ///# }
    ///# fn get_user() -> User { unimplemented!() }
    ///# fn create_user(user: Json<User>) -> i32 { unimplemented!() }
    /// ```
    pub fn map_group<'a>(&'a mut self, prefix: &'a str) -> RouteGroup<'a> {
        RouteGroup::new(self, prefix)
    }
    
    /// Adds a request handler that matches HTTP GET requests for the specified pattern.
    /// 
    /// # Examples
    /// ```no_run
    /// use volga::{App, ok};
    ///
    ///# #[tokio::main]
    ///# async fn main() -> std::io::Result<()> {
    /// let mut app = App::new();
    /// 
    /// app.map_get("/hello", || async {
    ///    ok!("Hello World!")
    /// });
    ///# app.run().await
    ///# }
    /// ```
    pub fn map_get<F, Args>(&mut self, pattern: &str, handler: F) -> &mut Self
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static
    {
        let handler = Func::new(handler);
        let endpoints = self.pipeline.endpoints_mut();
        endpoints.map_route(Method::GET, pattern, handler.clone());
        
        let head = Method::HEAD;
        if !endpoints.contains(&head, pattern) { 
            endpoints.map_route(head, pattern, handler.clone());
        }
        self
    }

    /// Adds a request handler that matches HTTP POST requests for the specified pattern.
    /// 
    /// # Examples
    /// ```no_run
    /// use volga::{App, File, ok};
    ///
    ///# #[tokio::main]
    ///# async fn main() -> std::io::Result<()> {
    /// let mut app = App::new();
    /// 
    /// app.map_post("/upload", |file: File| async move {
    ///     file.save("example.txt").await?;
    ///     ok!()
    /// });
    ///# app.run().await
    ///# }
    /// ```
    pub fn map_post<F, Args>(&mut self, pattern: &str, handler: F) -> &mut Self
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static,
    {
        let handler = Func::new(handler);
        self.pipeline
            .endpoints_mut()
            .map_route(Method::POST, pattern, handler);
        self
    }

    /// Adds a request handler that matches HTTP PUT requests for the specified pattern.
    /// 
    /// # Examples
    /// ```no_run
    /// use volga::{App, ok};
    ///
    ///# #[tokio::main]
    ///# async fn main() -> std::io::Result<()> {
    /// let mut app = App::new();
    /// 
    /// app.map_put("/hello", || async {
    ///    ok!("Hello World!")
    /// });
    ///# app.run().await
    ///# }
    /// ```
    pub fn map_put<F, Args>(&mut self, pattern: &str, handler: F) -> &mut Self
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static,
    {
        let handler = Func::new(handler);
        self.pipeline
            .endpoints_mut()
            .map_route(Method::PUT, pattern, handler);
        self
    }

    /// Adds a request handler that matches HTTP PATCH requests for the specified pattern.
    /// 
    /// # Examples
    /// ```no_run
    /// use volga::{App, ok};
    ///
    ///# #[tokio::main]
    ///# async fn main() -> std::io::Result<()> {
    /// let mut app = App::new();
    /// 
    /// app.map_patch("/hello", || async {
    ///    ok!("Hello World!")
    /// });
    ///# app.run().await
    ///# }
    /// ```
    pub fn map_patch<F, Args>(&mut self, pattern: &str, handler: F) -> &mut Self
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static,
    {
        let handler = Func::new(handler);
        self.pipeline
            .endpoints_mut()
            .map_route(Method::PATCH, pattern, handler);
        self
    }

    /// Adds a request handler that matches HTTP DELETE requests for the specified pattern.
    /// 
    /// # Examples
    /// ```no_run
    /// use volga::{App, ok};
    ///
    ///# #[tokio::main]
    ///# async fn main() -> std::io::Result<()> {
    /// let mut app = App::new();
    /// 
    /// app.map_delete("/delete/{id}", |id: i32| async move {
    ///    ok!("Item with ID: {} has been removed!", id)
    /// });
    ///# app.run().await
    ///# }
    /// ```
    pub fn map_delete<F, Args>(&mut self, pattern: &str, handler: F) -> &mut Self
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static,
    {
        let handler = Func::new(handler);
        self.pipeline
            .endpoints_mut()
            .map_route(Method::DELETE, pattern, handler);
        self
    }

    /// Adds a request handler that matches HTTP HEAD requests for the specified pattern.
    /// 
    /// # Examples
    /// ```no_run
    /// use volga::{App, ok};
    ///
    ///# #[tokio::main]
    ///# async fn main() -> std::io::Result<()> {
    /// let mut app = App::new();
    /// 
    /// app.map_head("/resource/{id}", |id: i32| async move {
    ///    ok!([("Custom-Header", "value")])
    /// });
    ///# app.run().await
    ///# }
    /// ```
    pub fn map_head<F, Args>(&mut self, pattern: &str, handler: F) -> &mut Self
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static,
    {
        let handler = Func::new(handler);
        self.pipeline
            .endpoints_mut()
            .map_route(Method::HEAD, pattern, handler);
        self
    }

    /// Adds a request handler that matches HTTP OPTIONS requests for the specified pattern.
    /// 
    /// # Examples
    /// ```no_run
    /// use volga::{App, ok};
    ///
    ///# #[tokio::main]
    ///# async fn main() -> std::io::Result<()> {
    /// let mut app = App::new();
    /// 
    /// app.map_options("/resource/{id}", |id: i32| async move {
    ///    ok!([("Allow", "GET, HEAD, POST, OPTIONS")])
    /// });
    ///# app.run().await
    ///# }
    /// ```
    pub fn map_options<F, Args>(&mut self, pattern: &str, handler: F) -> &mut Self
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static,
    {
        let handler = Func::new(handler);
        self.pipeline
            .endpoints_mut()
            .map_route(Method::OPTIONS, pattern, handler);
        self
    }

    /// Adds a request handler that matches HTTP TRACE requests for the specified pattern.
    /// 
    /// # Examples
    /// ```no_run
    /// use volga::{App, ok};
    ///
    ///# #[tokio::main]
    ///# async fn main() -> std::io::Result<()> {
    /// let mut app = App::new();
    /// 
    /// app.map_trace("/", |id: i32| async move {
    ///    ok!([("content-type", "message/http")])
    /// });
    ///# app.run().await
    ///# }
    /// ```
    pub fn map_trace<F, Args>(&mut self, pattern: &str, handler: F) -> &mut Self
    where
        F: GenericHandler<Args, Output = HttpResult>,
        Args: FromRequest + Send + Sync + 'static,
    {
        let handler = Func::new(handler);
        self.pipeline
            .endpoints_mut()
            .map_route(Method::TRACE, pattern, handler);
        self
    }
}

/// Represents a group of routes
pub struct RouteGroup<'a> {
    app: &'a mut App,
    prefix: &'a str,
}

macro_rules! define_route_group_methods({$($method:ident)*} => {
    impl <'a> RouteGroup<'a> {
        /// Creates a new route group
        fn new(app: &'a mut App, prefix: &'a str) -> Self {
            RouteGroup { app, prefix }
        }
            
        $(
        #[doc = concat!("See [`App::", stringify!($method), "`] for more details.")]
        pub fn $method<F, Args>(&mut self, pattern: &str, handler: F) -> &mut Self
        where
            F: GenericHandler<Args, Output = HttpResult>,
            Args: FromRequest + Send + Sync + 'static
        {
            let pattern = [self.prefix, pattern].concat();
            self.app.$method(&pattern, handler);
            self
        }
        )*
        }
});

define_route_group_methods! { 
    map_get
    map_post
    map_put
    map_patch
    map_delete
    map_head
    map_options
    map_trace
}
