use volga::{App, ok};

#[derive(serde::Serialize)]
struct User {
    name: String,
    age: i32,
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let mut app = App::new();

    app.use_compression();
    
    app.map_get("/compressed", || async {
        let mut values = Vec::new();
        for i in 0..10000 {
            values.push(User { age: i, name: i.to_string() });
        }
        ok!(values)
    });

    app.run().await
}