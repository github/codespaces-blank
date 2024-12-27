use volga::{App, HttpResult, ok};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let mut app = App::new();

    app.map_group("/user")
        .map_get("/{id}", get_user)
        .map_post("/create/{name}", create_user);

    app.run().await
}

async fn get_user(_id: i32) -> HttpResult {
    ok!("John")
}

async fn create_user(name: String) -> HttpResult {
    ok!("User {name} created!")
}