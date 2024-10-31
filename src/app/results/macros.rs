/// Produces an `OK 200` response with plain text or JSON body
/// 
/// # Examples
/// ## plain/text
/// ```no_run
///use volga::{ok, App, AsyncEndpointsMapping};
///
///#[tokio::main]
///async fn main() -> std::io::Result<()> {
///    let mut app = App::build("127.0.0.1:7878").await?;
///    
///    app.map_get("/health", |_req| async {
///        ok!("healthy")
///    });
///    
///    app.run().await
///}
/// ```
/// ## plain/text without body
/// ```no_run
///use volga::{ok, App, AsyncEndpointsMapping};
///
///#[tokio::main]
///async fn main() -> std::io::Result<()> {
///    let mut app = App::build("127.0.0.1:7878").await?;
///    
///    app.map_get("/health", |_req| async {
///        ok!()
///    });
///    
///    app.run().await
///}
/// ```
/// ## JSON
///```no_run
///use volga::{ok, App, AsyncEndpointsMapping};
///use serde::Serialize;
///
///#[derive(Serialize)]
///struct Health {
///    status: String
///}
///
///#[tokio::main]
///async fn main() -> std::io::Result<()> {
///    let mut app = App::build("127.0.0.1:7878").await?;
///    
///    app.map_get("/health", |_req| async {
///        let health = Health { status: "healthy".into() };
///        ok!(&health, json)
///    });
///    
///    app.run().await
///}
/// ```
/// ## File
///```no_run
///use volga::{ok, App, AsyncEndpointsMapping};
///use serde::Serialize;
///
///#[tokio::main]
///async fn main() -> std::io::Result<()> {
///    let mut app = App::build("127.0.0.1:7878").await?;
///    
///    app.map_get("/health", |_req| async {
///        let file_name = "example.txt";
///        let file_data = b"Hello, this is some file content!".to_vec();
///        
///        ok!(file_name, file_data, file)
///    });
///    
///    app.run().await
///}
/// ```
#[macro_export]
macro_rules! ok {
    () => {
        $crate::Results::ok()
    };
    ($e:expr) => {
        $crate::Results::text($e)
    };
    ($e:expr, json) => {
        $crate::Results::json($e)
    };
    ($file_name:expr, $e:expr, file) => {
        $crate::Results::file($file_name, $e)
    };
}

/// Produces a response with specified `StatusCode` with plain text or JSON body
/// 
/// # Examples
/// ## Without body
/// ```no_run
///use volga::{status, App, AsyncEndpointsMapping};
///
///#[tokio::main]
///async fn main() -> std::io::Result<()> {
///    let mut app = App::build("127.0.0.1:7878").await?;
///    
///    app.map_get("/test", |_req| async {
///        status!(404)
///    });
///    
///    app.run().await
///}
/// ```
/// ## With plain/text body
/// ```no_run
///use volga::{status, App, AsyncEndpointsMapping};
///
///#[tokio::main]
///async fn main() -> std::io::Result<()> {
///    let mut app = App::build("127.0.0.1:7878").await?;
///    
///    app.map_get("/test", |_req| async {
///        status!(401, "Unauthorized!")
///    });
///    
///    app.run().await
///}
/// ```
/// ## With JSON body
/// ```no_run
///use volga::{status, App, AsyncEndpointsMapping};
///use serde::Serialize;
/// 
///#[derive(Serialize)]
///struct ErrorMessage {
///    error: String
///}
/// 
///#[tokio::main]
///async fn main() -> std::io::Result<()> {
///    let mut app = App::build("127.0.0.1:7878").await?;
///    
///    app.map_get("/test", |_req| async {
///        let error = ErrorMessage { error: "some error message".into() };
///        status!(401, &error, json)
///    });
///    
///    app.run().await
///}
/// ```
#[macro_export]
macro_rules! status {
    (200) => {
        $crate::Results::ok()
    };
    (200, $e:expr) => {
        $crate::Results::text($e)
    };
    (200, $e:expr, json) => {
        $crate::Results::json($e)
    };
    (200, $file_name:expr, $e:expr, file) => {
        $crate::Results::file($file_name, $e)
    };
    (400) => {
        $crate::Results::ok()
    };
    (400, $e:expr) => {
        $crate::Results::text($e)
    };
    (400, $e:expr, json) => {
        $crate::Results::json($e)
    };
    (404) => {
        $crate::Results::not_found()
    };
    (401) => {
        $crate::Results::status(
            http::StatusCode::UNAUTHORIZED, 
            mime::TEXT_PLAIN.as_ref(), 
            bytes::Bytes::new())
    };
    (401, $e:expr) => {
        $crate::Results::status(
            http::StatusCode::UNAUTHORIZED, 
            mime::TEXT_PLAIN.as_ref(), 
            bytes::Bytes::from(String::from($e)))
    };
    (401, $e:expr, json) => {
        $crate::Results::json_with_status(http::StatusCode::UNAUTHORIZED, $e)
    };
    (403) => {
        $crate::Results::status(
            http::StatusCode::FORBIDDEN, 
            mime::TEXT_PLAIN.as_ref(), 
            bytes::Bytes::new())
    };
    (403, $e:expr) => {
        $crate::Results::status(
            http::StatusCode::FORBIDDEN, 
            mime::TEXT_PLAIN.as_ref(), 
            bytes::Bytes::from(String::from($e)))
    };
    (403, $e:expr, json) => {
        $crate::Results::json_with_status(http::StatusCode::FORBIDDEN, $e)
    };
}

#[cfg(test)]
mod tests {
    use serde::Serialize;

    #[derive(Serialize)]
    struct TestPayload {
        name: String
    }
    
    #[test]
    fn it_creates_json_ok_response() {
        let payload = TestPayload { name: "test".into() };
        let response = ok!(&payload, json);
        
        assert!(response.is_ok());
        assert_eq!(response.unwrap().body().len(), 15);
    }

    #[test]
    fn it_creates_text_ok_response() {
        let text = "test";
        let response = ok!(text);

        assert!(response.is_ok());
        assert_eq!(response.unwrap().body().len(), 4);
    }
    
    #[test]
    fn it_creates_empty_ok_response() {
        let response = ok!();

        assert!(response.is_ok());
        assert_eq!(response.unwrap().body().len(), 0);
    }

    #[test]
    fn it_creates_file_with_ok_response() {
        let file_name = "example.txt";
        let file_data = b"Hello, this is some file content!";
        
        let response = ok!(file_name, file_data.to_vec(), file);

        assert!(response.is_ok());
        assert_eq!(response.unwrap().body().len(), 33);
    }

    #[test]
    fn it_creates_200_response() {
        let response = status!(200);

        assert!(response.is_ok());
        assert_eq!(response.unwrap().body().len(), 0);
    }

    #[test]
    fn it_creates_200_with_text_response() {
        let text = "test";
        let response = status!(200, text);

        assert!(response.is_ok());
        assert_eq!(response.unwrap().body().len(), 4);
    }

    #[test]
    fn it_creates_200_with_json_response() {
        let payload = TestPayload { name: "test".into() };
        let response = status!(200, &payload, json);

        assert!(response.is_ok());
        assert_eq!(response.unwrap().body().len(), 15);
    }

    #[test]
    fn it_creates_200_with_file_response() {
        let file_name = "example.txt";
        let file_data = b"Hello, this is some file content!";

        let response = status!(200, file_name, file_data.to_vec(), file);

        assert!(response.is_ok());
        assert_eq!(response.unwrap().body().len(), 33);
    }

    #[test]
    fn it_creates_400_response() {
        let response = status!(400);

        assert!(response.is_ok());
        assert_eq!(response.unwrap().body().len(), 0);
    }

    #[test]
    fn it_creates_400_with_text_response() {
        let text = "test";
        let response = status!(400, text);

        assert!(response.is_ok());
        assert_eq!(response.unwrap().body().len(), 4);
    }

    #[test]
    fn it_creates_400_with_json_response() {
        let payload = TestPayload { name: "test".into() };
        let response = status!(400, &payload, json);

        assert!(response.is_ok());
        assert_eq!(response.unwrap().body().len(), 15);
    }
    
    #[test]
    fn it_creates_404_response() {
        let response = status!(404);

        assert!(response.is_ok());
        assert_eq!(response.unwrap().body().len(), 0);
    }

    #[test]
    fn it_creates_empty_401_response() {
        let response = status!(401);

        assert!(response.is_ok());
        assert_eq!(response.unwrap().body().len(), 0);
    }

    #[test]
    fn it_creates_401_response_with_text_body() {
        let response = status!(401, "You are not authorized!");

        assert!(response.is_ok());
        assert_eq!(response.unwrap().body().len(), 23);
    }

    #[test]
    fn it_creates_401_response_with_json_body() {
        let payload = TestPayload { name: "test".into() };
        let response = status!(401, &payload, json);

        assert!(response.is_ok());
        assert_eq!(response.unwrap().body().len(), 15);
    }

    #[test]
    fn it_creates_empty_403_response() {
        let response = status!(403);

        assert!(response.is_ok());
        assert_eq!(response.unwrap().body().len(), 0);
    }

    #[test]
    fn it_creates_403_response_with_text_body() {
        let response = status!(403, "It's forbidden!");

        assert!(response.is_ok());
        assert_eq!(response.unwrap().body().len(), 15);
    }

    #[test]
    fn it_creates_403_response_with_json_body() {
        let payload = TestPayload { name: "test".into() };
        let response = status!(403, &payload, json);
        
        assert!(response.is_ok());
        assert_eq!(response.unwrap().body().len(), 15);
    }
}