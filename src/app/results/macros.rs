﻿/// Produces an `OK 200` response with plain text or JSON body
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
///        ok!(&health)
///    });
///    
///    app.run().await
///}
/// ```
/// ## Untyped JSON with custom headers
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
///        ok!({ "health": "healthy" }, [
///            ("x-api-key", "some api key")
///        ])
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
    ({ $($json:tt)* }) => {
        $crate::Results::json(&serde_json::json_internal!({ $($json)* }))
    };
    ({ $($json:tt)* }, [ $( ($key:expr, $value:expr) ),* $(,)? ]) => {{
        // We're not using a headers! macro here to avoid adding unnecessary use if it's not needed
        let mut headers = std::collections::HashMap::new();
        $(
            headers.insert($key.to_string(), $value.to_string());
        )*
        $crate::Results::from($crate::ResponseContext {
            content: serde_json::json_internal!({ $($json)* }),
            headers: Some(headers),
            content_type: None
        })
    }};
    ($e:expr) => {
        $crate::Results::json($e)
    };
    ($e:expr, [ $( ($key:expr, $value:expr) ),* $(,)? ]) => {{
        // We're not using a headers! macro here to avoid adding unnecessary use if it's not needed
        let mut headers = std::collections::HashMap::new();
        $(
            headers.insert($key.to_string(), $value.to_string());
        )*
        $crate::Results::from($crate::ResponseContext {
            content: $e,
            headers: Some(headers),
            content_type: None
        })
    }};
}

/// Produces `OK 200` response with file body
/// # Examples
///```no_run
///use volga::{file, App, AsyncEndpointsMapping};
///use serde::Serialize;
///
///#[tokio::main]
///async fn main() -> std::io::Result<()> {
///    let mut app = App::build("127.0.0.1:7878").await?;
///    
///    app.map_get("/download", |_req| async {
///        let file_name = "example.txt";
///        let file_data = b"Hello, this is some file content!".to_vec();
///        
///        file!(file_name, file_data)
///    });
///    
///    app.run().await
///}
/// ```
#[macro_export]
macro_rules! file {
    ($file_name:expr, $e:expr) => {
        $crate::Results::file($file_name, $e)
    };
}

/// Creates HTTP Request/Response headers
/// # Examples
///```no_run
///use volga::headers;
///
///let headers = headers![
///    ("header 1", "value 1"),
///    ("header 2", "value 2"),
///];
/// ```
#[macro_export]
macro_rules! headers {
    ( $( ($key:expr, $value:expr) ),* $(,)? ) => {{
        let mut map = std::collections::HashMap::new();
        $(
            map.insert($key.to_string(), $value.to_string());
        )*
        map
    }};
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
///        status!(401, &error)
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
    (200, { $($json:tt)* }) => {
        $crate::Results::json(&serde_json::json_internal!({ $($json)* }))
    };
    (200, $e:expr) => {
        $crate::Results::json($e)
    };
    (200, $file_name:expr, $e:expr) => {
        $crate::Results::file($file_name, $e)
    };
    (400) => {
        $crate::Results::bad_request(None)
    };
    (400, { $($json:tt)* }) => {
        $crate::Results::json_with_status(http::StatusCode::BAD_REQUEST, &serde_json::json_internal!({ $($json)* }))
    };
    (400, $e:expr) => {
        $crate::Results::json_with_status(http::StatusCode::BAD_REQUEST, $e)
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
    (401, { $($json:tt)* }) => {
        $crate::Results::json_with_status(http::StatusCode::UNAUTHORIZED, &serde_json::json_internal!({ $($json)* }))
    };
    (401, $e:expr) => {
        $crate::Results::json_with_status(http::StatusCode::UNAUTHORIZED, $e)
    };
    (403) => {
        $crate::Results::status(
            http::StatusCode::FORBIDDEN, 
            mime::TEXT_PLAIN.as_ref(), 
            bytes::Bytes::new())
    };
    (403, { $($json:tt)* }) => {
        $crate::Results::json_with_status(http::StatusCode::FORBIDDEN, &serde_json::json_internal!({ $($json)* }))
    };
    (403, $e:expr) => {
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
        let response = ok!(&payload);
        
        let response = response.unwrap();

        assert_eq!(String::from_utf8_lossy(response.body()), "{\"name\":\"test\"}");
        assert_eq!(response.headers().get("Content-Type").unwrap(), "application/json");
    }

    #[test]
    fn it_creates_anonymous_type_json_ok_response() {
        let response = ok!({ "name": "test" });

        assert!(response.is_ok());
        assert_eq!(String::from_utf8_lossy(response.unwrap().body()), "{\"name\":\"test\"}");
    }
    
    #[test]
    fn it_creates_text_ok_response() {
        let text = "test";
        let response = ok!(text);

        assert!(response.is_ok());
        assert_eq!(String::from_utf8_lossy(response.unwrap().body()), "\"test\"");
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
        
        let response = file!(file_name, file_data.to_vec());

        assert!(response.is_ok());
        assert_eq!(String::from_utf8_lossy(response.unwrap().body()), "Hello, this is some file content!");
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
        assert_eq!(String::from_utf8_lossy(response.unwrap().body()), "\"test\"");
    }

    #[test]
    fn it_creates_200_with_json_response() {
        let payload = TestPayload { name: "test".into() };
        let response = status!(200, &payload);

        assert!(response.is_ok());
        assert_eq!(String::from_utf8_lossy(response.unwrap().body()), "{\"name\":\"test\"}");
    }

    #[test]
    fn it_creates_anonymous_type_200_response_with_json_body() {
        let response = status!(200, { "name": "test" });

        assert!(response.is_ok());
        assert_eq!(String::from_utf8_lossy(response.unwrap().body()), "{\"name\":\"test\"}");
    }

    #[test]
    fn it_creates_200_with_file_response() {
        let file_name = "example.txt";
        let file_data = b"Hello, this is some file content!";

        let response = status!(200, file_name, file_data.to_vec());

        assert!(response.is_ok());
        assert_eq!(String::from_utf8_lossy(response.unwrap().body()), "Hello, this is some file content!");
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
        assert_eq!(String::from_utf8_lossy(response.unwrap().body()), "\"test\"");
    }

    #[test]
    fn it_creates_400_with_json_response() {
        let payload = TestPayload { name: "test".into() };
        let response = status!(400, &payload);

        assert!(response.is_ok());
        assert_eq!(String::from_utf8_lossy(response.unwrap().body()), "{\"name\":\"test\"}");
    }

    #[test]
    fn it_creates_anonymous_type_400_response_with_json_body() {
        let response = status!(400, { "name": "test" });

        assert!(response.is_ok());
        assert_eq!(String::from_utf8_lossy(response.unwrap().body()), "{\"name\":\"test\"}");
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
        assert_eq!(String::from_utf8_lossy(response.unwrap().body()), "\"You are not authorized!\"");
    }

    #[test]
    fn it_creates_401_response_with_json_body() {
        let payload = TestPayload { name: "test".into() };
        let response = status!(401, &payload);

        assert!(response.is_ok());
        assert_eq!(String::from_utf8_lossy(response.unwrap().body()), "{\"name\":\"test\"}");
    }

    #[test]
    fn it_creates_anonymous_type_401_response_with_json_body() {
        let response = status!(401, { "name": "test" });

        assert!(response.is_ok());
        assert_eq!(String::from_utf8_lossy(response.unwrap().body()), "{\"name\":\"test\"}");
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
        assert_eq!(String::from_utf8_lossy(response.unwrap().body()), "\"It's forbidden!\"");
    }

    #[test]
    fn it_creates_403_response_with_json_body() {
        let payload = TestPayload { name: "test".into() };
        let response = status!(403, &payload);
        
        assert!(response.is_ok());
        assert_eq!(String::from_utf8_lossy(response.unwrap().body()), "{\"name\":\"test\"}");
    }

    #[test]
    fn it_creates_anonymous_type_403_response_with_json_body() {
        let response = status!(403, { "name": "test" });

        assert!(response.is_ok());
        assert_eq!(String::from_utf8_lossy(response.unwrap().body()), "{\"name\":\"test\"}");
    }
    
    #[test]
    fn it_creates_headers() {
        let headers = headers![
            ("header 1", "value 1"),
            ("header 2", "value 2")
        ];
        
        assert_eq!(headers.get("header 1").unwrap(), "value 1");
        assert_eq!(headers.get("header 2").unwrap(), "value 2")
    }
    
    #[test]
    fn in_creates_text_response_with_custom_headers() {
        let response = ok!("ok", [
            ("x-api-key", "some api key"),
            ("x-req-id", "some req id"),
        ]);
        
        assert!(response.is_ok());
        
        let response = response.unwrap();
        
        assert_eq!(String::from_utf8_lossy(response.body()), "\"ok\"");
        assert_eq!(response.headers().get("x-api-key").unwrap(), "some api key");
        assert_eq!(response.headers().get("x-req-id").unwrap(), "some req id");
    }

    #[test]
    fn in_creates_json_response_with_custom_headers() {
        let payload = TestPayload { name: "test".into() };
        let response = ok!(&payload, [
            ("x-api-key", "some api key"),
            ("x-req-id", "some req id"),
        ]);

        assert!(response.is_ok());

        let response = response.unwrap();

        assert_eq!(String::from_utf8_lossy(response.body()), "{\"name\":\"test\"}");
        assert_eq!(response.headers().get("x-api-key").unwrap(), "some api key");
        assert_eq!(response.headers().get("x-req-id").unwrap(), "some req id");
    }

    #[test]
    fn in_creates_anonymous_json_response_with_custom_headers() {
        let response = ok!({ "name": "test" }, [
            ("x-api-key", "some api key"),
            ("x-req-id", "some req id"),
        ]);

        assert!(response.is_ok());

        let response = response.unwrap();

        assert_eq!(String::from_utf8_lossy(response.body()), "{\"name\":\"test\"}");
        assert_eq!(response.headers().get("x-api-key").unwrap(), "some api key");
        assert_eq!(response.headers().get("x-req-id").unwrap(), "some req id");
    }
}