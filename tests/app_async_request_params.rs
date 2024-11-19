use volga::{App, Results, AsyncEndpointsMapping, Params};

#[tokio::test]
async fn it_reads_route_params() {
    tokio::spawn(async {
        let mut app = App::build("127.0.0.1:7887").await?;

        app.map_get("/test/{name}/{age}", |req| async move {
            let name = req.param("name")?;
            let age = req.param("age")?;
            
            let response = format!("My name is: {}, I'm {} years old", name, age);

            Results::text(&response)
        });

        app.run().await
    });

    let response = tokio::spawn(async {
        let client = if cfg!(all(feature = "http1", not(feature = "http2"))) {
            reqwest::Client::builder().http1_only().build().unwrap()
        } else {
            reqwest::Client::builder().http2_prior_knowledge().build().unwrap()
        };
        client.get("http://127.0.0.1:7887/test/John/35").send().await
    }).await.unwrap().unwrap();

    assert!(response.status().is_success());
    assert_eq!(response.text().await.unwrap(), "My name is: John, I'm 35 years old");
}

#[tokio::test]
async fn it_reads_query_params() {
    tokio::spawn(async {
        let mut app = App::build("127.0.0.1:7888").await?;

        app.map_get("/test", |req| async move {
            let name = req.param("name")?;
            let age = req.param("age")?;

            let response = format!("My name is: {}, I'm {} years old", name, age);

            Results::text(&response)
        });

        app.run().await
    });

    let response = tokio::spawn(async {
        let client = if cfg!(all(feature = "http1", not(feature = "http2"))) {
            reqwest::Client::builder().http1_only().build().unwrap()
        } else {
            reqwest::Client::builder().http2_prior_knowledge().build().unwrap()
        };
        client.get("http://127.0.0.1:7888/test?name=John&age=35").send().await
    }).await.unwrap().unwrap();

    assert!(response.status().is_success());
    assert_eq!(response.text().await.unwrap(), "My name is: John, I'm 35 years old");
}