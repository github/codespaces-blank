//! Extractors for Dependency Injection

use std::{
    ops::{Deref, DerefMut},
    io::Error
};

use futures_util::future::{ready, Ready};

use crate::app::{
    endpoints::args::{FromPayload, Payload, Source},
    di::Inject
};

/// `Dc` stands for Dependency Container, This struct wraps the injectable type of `T` 
/// `T` must be registered in Dependency Injection Container
/// 
/// # Example
/// ```no_run
/// use volga::{App, di::Dc, ok, not_found};
/// use std::{
///     collections::HashMap,
///     sync::{Arc, Mutex}
/// };
/// 
/// #[derive(Clone, Default)]
/// struct InMemoryCache {
///     inner: Arc<Mutex<HashMap<String, String>>>
/// }
/// 
///# #[tokio::main]
///# async fn main() -> std::io::Result<()> {
/// let mut app = App::new();
/// 
/// app.add_singleton(InMemoryCache::default());
/// 
/// app.map_get("/user/{id}", |id: String, cache: Dc<InMemoryCache>| async move {
///     let cache_guard = cache.inner.lock().unwrap();
///     let user = cache_guard.get(&id);
///     match user { 
///         Some(user) => ok!(user),
///         None => not_found!()
///     }
/// });
///# app.run().await
///# }
/// ```
pub struct Dc<T: Inject>(pub T);

impl<T: Inject> Deref for Dc<T> {
    type Target = T;

    fn deref(&self) -> &T {
        &self.0
    }
}

impl<T: Inject> DerefMut for Dc<T> {
    fn deref_mut(&mut self) -> &mut T {
        &mut self.0
    }
}

impl<T: Inject + 'static> FromPayload for Dc<T> {
    type Future = Ready<Result<Self, Error>>;

    fn from_payload(payload: Payload) -> Self::Future {
        if let Payload::Dc(container) = payload {
            let dependency = container
                .resolve::<T>()
                .map(Dc);
            ready(dependency)
        } else {
            unreachable!()
        }
    }

    fn source() -> Source {
        Source::Dc
    }
}