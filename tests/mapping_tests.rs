use reqwest::Method;
use volga::{App, HttpRequest, Results, Router};

#[tokio::test]
async fn it_maps_to_get_request() {
    tokio::spawn(async {
        let mut app = App::new().bind("127.0.0.1:7877");
        app.map_get("/test", || async {
            Results::text("Pass!")
        });
       app.run().await
    });

    let response = tokio::spawn(async {
        let client = if cfg!(all(feature = "http1", not(feature = "http2"))) {
            reqwest::Client::builder().http1_only().build().unwrap()
        } else {
            reqwest::Client::builder().http2_prior_knowledge().build().unwrap()
        };
        client.get("http://127.0.0.1:7877/test").send().await
    }).await.unwrap().unwrap();

    assert!(response.status().is_success());
    assert_eq!(response.text().await.unwrap(), "Pass!");
}

#[tokio::test]
async fn it_maps_to_post_request() {
    tokio::spawn(async {
        let mut app = App::new().bind("127.0.0.1:7876");
        app.map_post("/test", || async {
            Results::text("Pass!")
        });
       app.run().await
    });

    let response = tokio::spawn(async {
        let client = if cfg!(all(feature = "http1", not(feature = "http2"))) {
            reqwest::Client::builder().http1_only().build().unwrap()
        } else {
            reqwest::Client::builder().http2_prior_knowledge().build().unwrap()
        };
        client.post("http://127.0.0.1:7876/test").send().await
    }).await.unwrap().unwrap();

    assert!(response.status().is_success());
    assert_eq!(response.text().await.unwrap(), "Pass!");
}

#[tokio::test]
async fn it_maps_to_put_request() {
    tokio::spawn(async {
        let mut app = App::new().bind("127.0.0.1:7875");
        app.map_put("/test", || async {
            Results::text("Pass!")
        });
       app.run().await
    });

    let response = tokio::spawn(async {
        let client = if cfg!(all(feature = "http1", not(feature = "http2"))) {
            reqwest::Client::builder().http1_only().build().unwrap()
        } else {
            reqwest::Client::builder().http2_prior_knowledge().build().unwrap()
        };
        client.put("http://127.0.0.1:7875/test").send().await
    }).await.unwrap().unwrap();

    assert!(response.status().is_success());
    assert_eq!(response.text().await.unwrap(), "Pass!");
}

#[tokio::test]
async fn it_maps_to_patch_request() {
    tokio::spawn(async {
        let mut app = App::new().bind("127.0.0.1:7874");
        app.map_patch("/test", || async {
            Results::text("Pass!")
        });
       app.run().await
    });

    let response = tokio::spawn(async {
        let client = if cfg!(all(feature = "http1", not(feature = "http2"))) {
            reqwest::Client::builder().http1_only().build().unwrap()
        } else {
            reqwest::Client::builder().http2_prior_knowledge().build().unwrap()
        };
        client.patch("http://127.0.0.1:7874/test").send().await
    }).await.unwrap().unwrap();

    assert!(response.status().is_success());
    assert_eq!(response.text().await.unwrap(), "Pass!");
}

#[tokio::test]
async fn it_maps_to_delete_request() {
    tokio::spawn(async {
        let mut app = App::new().bind("127.0.0.1:7873");
        app.map_delete("/test", || async {
            Results::text("Pass!")
        });
       app.run().await
    });

    let response = tokio::spawn(async {
        let client = if cfg!(all(feature = "http1", not(feature = "http2"))) {
            reqwest::Client::builder().http1_only().build().unwrap()
        } else {
            reqwest::Client::builder().http2_prior_knowledge().build().unwrap()
        };
        client.delete("http://127.0.0.1:7873/test").send().await
    }).await.unwrap().unwrap();

    assert!(response.status().is_success());
    assert_eq!(response.text().await.unwrap(), "Pass!");
}

#[tokio::test]
async fn it_maps_to_head_request() {
    tokio::spawn(async {
        let mut app = App::new().bind("127.0.0.1:7903");
        app.map_head("/test", || async {
            Results::ok()
        });
        app.run().await
    });

    let response = tokio::spawn(async {
        let client = if cfg!(all(feature = "http1", not(feature = "http2"))) {
            reqwest::Client::builder().http1_only().build().unwrap()
        } else {
            reqwest::Client::builder().http2_prior_knowledge().build().unwrap()
        };
        client.head("http://127.0.0.1:7903/test").send().await
    }).await.unwrap().unwrap();

    assert!(response.status().is_success());
    assert_eq!(response.text().await.unwrap(), "");
}

#[tokio::test]
async fn it_maps_to_options_request() {
    tokio::spawn(async {
        let mut app = App::new().bind("127.0.0.1:7904");
        app.map_options("/test", || async {
            Results::ok()
        });
        app.run().await
    });

    let response = tokio::spawn(async {
        let client = if cfg!(all(feature = "http1", not(feature = "http2"))) {
            reqwest::Client::builder().http1_only().build().unwrap()
        } else {
            reqwest::Client::builder().http2_prior_knowledge().build().unwrap()
        };
        client.request(Method::OPTIONS, "http://127.0.0.1:7904/test").send().await
    }).await.unwrap().unwrap();

    assert!(response.status().is_success());
    assert_eq!(response.text().await.unwrap(), "");
}

#[tokio::test]
async fn it_maps_to_trace_request() {
    tokio::spawn(async {
        let mut app = App::new().bind("127.0.0.1:7905");
        app.map_trace("/test", |req: HttpRequest| async {
            let boxed_body = req.into_boxed_body();
            Results::stream(boxed_body)
        });
        app.run().await
    });
    
    let response = tokio::spawn(async {
        let client = if cfg!(all(feature = "http1", not(feature = "http2"))) {
            reqwest::Client::builder().http1_only().build().unwrap()
        } else {
            reqwest::Client::builder().http2_prior_knowledge().build().unwrap()
        };
        client.request(Method::TRACE, "http://127.0.0.1:7905/test").send().await
    }).await.unwrap().unwrap();

    assert!(response.status().is_success());
    assert_eq!(response.text().await.unwrap(), "");
}