//! Extractors for Dependency Injection

use std::{
    ops::{Deref, DerefMut},
    task::{Context, Poll},
    marker::PhantomData,
    future::Future,
    io::Error,
    pin::Pin,
};

use futures_util::{pin_mut, ready};
use pin_project_lite::pin_project;

use crate::http::endpoints::args::{FromPayload, Payload, Source};
use crate::di::{Container, Inject};

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

pin_project! {
    /// A future that resolves a dependency from DI container.
    pub struct ExtractDependencyFut<T> {
        #[pin]
        container: Container,
        _marker: PhantomData<T>
    }
}

impl<T: Inject + 'static> Future for ExtractDependencyFut<T> {
    type Output = Result<Dc<T>, Error>;
    
    #[inline]
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
        let mut this = self.project();
        let fut = this.container.resolve::<T>();
        pin_mut!(fut);
        let result = ready!(fut.poll(cx));
        Poll::Ready(result.map(Dc))
    }
}

impl<T: Inject + 'static> FromPayload for Dc<T> {
    type Future = ExtractDependencyFut<T>;

    fn from_payload(payload: Payload) -> Self::Future {
        if let Payload::Dc(container) = payload {
            ExtractDependencyFut { container: container.clone(), _marker: PhantomData }
        } else {
            unreachable!()
        }
    }

    fn source() -> Source {
        Source::Dc
    }
}

#[cfg(test)]
mod tests {
    use std::sync::{Arc, Mutex};
    use super::Dc;
    use crate::di::ContainerBuilder;
    use crate::http::endpoints::args::{FromPayload, Payload};
    
    type Cache = Arc<Mutex<Vec<i32>>>;
    
    #[tokio::test]
    async fn it_reads_from_payload() {
        let mut container = ContainerBuilder::new();
        
        container.register_scoped::<Cache>();
        
        let container = container.build();
        let mut scope = container.create_scope();
        
        let vec = scope.resolve::<Cache>().await.unwrap();
        vec.lock().unwrap().push(1);
        
        let dc = Dc::<Cache>::from_payload(Payload::Dc(&mut scope)).await.unwrap();
        dc.lock().unwrap().push(2);

        let dc = Dc::<Cache>::from_payload(Payload::Dc(&mut scope)).await.unwrap();
        dc.lock().unwrap().push(3);

        let dc = Dc::<Cache>::from_payload(Payload::Dc(&mut scope)).await.unwrap();
        let dc = dc.lock().unwrap();
        
        assert_eq!(dc[0], 1);
        assert_eq!(dc[1], 2);
        assert_eq!(dc[2], 3);
    }
}