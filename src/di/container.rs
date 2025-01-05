use super::{Inject, DiError};
use std::{
    any::{Any, TypeId},
    collections::HashMap,
    io::Error,
    sync::Arc
};

type ArcService = Arc<
    dyn Any
    + Send
    + Sync
>;

pub(crate) enum ServiceEntry {
    Singleton(ArcService),
    Scoped(Option<ArcService>),
    Transient,
}

/// Represents a DI container builder
pub struct ContainerBuilder {
    services: HashMap<TypeId, ServiceEntry>
}

impl Default for ContainerBuilder {
    fn default() -> Self {
        Self::new()
    }
}

impl ContainerBuilder {
    /// Create a new DI container builder
    pub fn new() -> Self {
        Self { services: HashMap::new() }
    }

    /// Build a DI container
    pub fn build(self) -> Container {
        Container {
            services: self.services
        }
    }

    /// Register a singleton service
    pub fn register_singleton<T: Inject + 'static>(&mut self, instance: T) {
        let entry = ServiceEntry::Singleton(Arc::new(instance));
        self.services.insert(TypeId::of::<T>(), entry);
    }

    /// Register a scoped service
    pub fn register_scoped<T: Inject + 'static>(&mut self) {
        let entry = ServiceEntry::Scoped(None);
        self.services.insert(TypeId::of::<T>(), entry);
    }

    /// Register a transient service
    pub fn register_transient<T: Inject + 'static>(&mut self) {
        let entry = ServiceEntry::Transient;
        self.services.insert(TypeId::of::<T>(), entry);
    }
}

/// Represents a DI container
pub struct Container {
    services: HashMap<TypeId, ServiceEntry>
}

impl Clone for Container {
    fn clone(&self) -> Self {
        let mut new_services = HashMap::new();
        for (key, value) in &self.services {
            let cloned_value = match value {
                ServiceEntry::Singleton(service) => ServiceEntry::Singleton(service.clone()),
                ServiceEntry::Scoped(service) => ServiceEntry::Scoped(service.clone()),
                ServiceEntry::Transient => ServiceEntry::Transient,
            };
            new_services.insert(*key, cloned_value);
        }
        Self { services: new_services }
    }
}

impl Container {
    /// Creates a new container where Scoped services are not created yet
    pub fn create_scope(&self) -> Self {
        let mut new_services = HashMap::new();
        for (key, value) in &self.services {
            let cloned_value = match value {
                ServiceEntry::Singleton(service) => ServiceEntry::Singleton(service.clone()),
                ServiceEntry::Scoped(_) => ServiceEntry::Scoped(None),
                ServiceEntry::Transient => ServiceEntry::Transient,
            };
            new_services.insert(*key, cloned_value);
        }
        Self { services: new_services }
    }

    /// Resolve a service
    pub async fn resolve<T: Inject + 'static>(&mut self) -> Result<T, Error> {
        let type_id = TypeId::of::<T>();
        let entry = self.services.get(&type_id);
        if entry.is_none() {
            return Err(DiError::service_not_registered(std::any::type_name::<T>()));
        }
        if let Some(service_entry) = entry {
            return match service_entry {
                ServiceEntry::Transient => T::inject(self).await,
                ServiceEntry::Singleton(instance) => Self::resolve_internal(instance),
                ServiceEntry::Scoped(maybe_instance) => {
                    if let Some(instance) = maybe_instance {
                        Self::resolve_internal(instance)
                    } else {
                        self.register_scoped(type_id).await
                    }
                }
            }
        }
        unreachable!();
    }

    #[inline]
    fn resolve_internal<T: Inject + 'static>(instance: &ArcService) -> Result<T, Error> {
        (**instance).downcast_ref::<T>()
            .ok_or(DiError::resolve_error(std::any::type_name::<T>()))
            .cloned()
    }

    #[inline]
    async fn register_scoped<T: Inject + 'static>(&mut self, type_id: TypeId) -> Result<T, Error> {
        let new_instance = T::inject(self).await?;
        let clone = new_instance.clone();
        let entry = ServiceEntry::Scoped(Some(Arc::new(new_instance)));
        self.services.insert(type_id, entry);
        Ok(clone)
    }
}

#[cfg(test)]
mod tests {
    use std::collections::HashMap;
    use std::io::Error;
    use std::sync::{Arc, Mutex};
    use super::{Container, ContainerBuilder, Inject};

    trait Cache: Send + Sync {
        fn get(&self, key: &str) -> Option<String>;
        fn set(&self, key: &str, value: &str);
    }

    #[derive(Clone, Default)]
    struct InMemoryCache {
        inner: Arc<Mutex<HashMap<String, String>>>
    }

    impl Cache for InMemoryCache {
        fn get(&self, key: &str) -> Option<String> {
            self.inner
                .lock()
                .unwrap()
                .get(key)
                .cloned()
        }

        fn set(&self, key: &str, value: &str) {
            self.inner
                .lock()
                .unwrap()
                .insert(key.to_string(), value.to_string());
        }
    }

    #[derive(Clone)]
    struct CacheWrapper {
        inner: InMemoryCache
    }

    impl Inject for CacheWrapper {
        async fn inject(container: &mut Container) -> Result<Self, Error> {
            Ok(Self { inner: container.resolve().await? })
        }
    }

    #[tokio::test]
    async fn it_registers_singleton() {
        let mut container = ContainerBuilder::new();
        container.register_singleton(InMemoryCache::default());

        let mut container = container.build();

        let cache = container.resolve::<InMemoryCache>().await.unwrap();
        cache.set("key", "value");

        let cache = container.resolve::<InMemoryCache>().await.unwrap();
        let key = cache.get("key").unwrap();

        assert_eq!(key, "value");
    }

    #[tokio::test]
    async fn it_registers_transient() {
        let mut container = ContainerBuilder::new();
        container.register_transient::<InMemoryCache>();

        let mut container = container.build();

        let cache = container.resolve::<InMemoryCache>().await.unwrap();
        cache.set("key", "value");

        let cache = container.resolve::<InMemoryCache>().await.unwrap();
        let key = cache.get("key");

        assert!(key.is_none());
    }

    #[tokio::test]
    async fn it_registers_scoped() {
        let mut container = ContainerBuilder::new();
        container.register_scoped::<InMemoryCache>();

        let mut container = container.build();

        // working in the initial scope
        let cache = container.resolve::<InMemoryCache>().await.unwrap();
        cache.set("key", "value 1");

        // create a new scope so new instance of InMemoryCache will be created
        {
            let mut scope = container.create_scope();
            let cache = scope.resolve::<InMemoryCache>().await.unwrap();
            cache.set("key", "value 2");

            let cache = scope.resolve::<InMemoryCache>().await.unwrap();
            let key = cache.get("key").unwrap();

            assert_eq!(key, "value 2");
        }

        // create a new scope so new instance of InMemoryCache will be created
        {
            let mut scope = container.create_scope();
            let cache = scope.resolve::<InMemoryCache>().await.unwrap();
            let key = cache.get("key");

            assert!(key.is_none());
        }

        let key = cache.get("key").unwrap();

        assert_eq!(key, "value 1");
    }

    #[tokio::test]
    async fn it_resolves_inner_dependencies() {
        let mut container = ContainerBuilder::new();

        container.register_singleton(InMemoryCache::default());
        container.register_scoped::<CacheWrapper>();

        let mut container = container.build();

        {
            let mut scope = container.create_scope();
            let cache = scope.resolve::<CacheWrapper>().await.unwrap();
            cache.inner.set("key", "value 1");
        }

        let cache = container.resolve::<InMemoryCache>().await.unwrap();
        let key = cache.get("key").unwrap();

        assert_eq!(key, "value 1");
    }

    #[tokio::test]
    async fn inner_scope_does_not_affect_outer() {
        let mut container = ContainerBuilder::new();

        container.register_scoped::<InMemoryCache>();
        container.register_scoped::<CacheWrapper>();

        let mut container = container.build();

        {
            let mut scope = container.create_scope();
            let cache = scope.resolve::<CacheWrapper>().await.unwrap();
            cache.inner.set("key", "value 1");

            let cache = scope.resolve::<CacheWrapper>().await.unwrap();
            cache.inner.set("key", "value 2");
        }

        let cache = container.resolve::<InMemoryCache>().await.unwrap();
        let key = cache.get("key");

        assert!(key.is_none())
    }

    #[tokio::test]
    async fn it_resolves_inner_scoped_dependencies() {
        let mut container = ContainerBuilder::new();

        container.register_scoped::<InMemoryCache>();
        container.register_scoped::<CacheWrapper>();

        let container = container.build();

        let mut scope = container.create_scope();
        let cache = scope.resolve::<CacheWrapper>().await.unwrap();
        cache.inner.set("key1", "value 1");

        let cache = scope.resolve::<CacheWrapper>().await.unwrap();
        cache.inner.set("key2", "value 2");

        let cache = scope.resolve::<CacheWrapper>().await.unwrap();

        assert_eq!(cache.inner.get("key1").unwrap(), "value 1");
        assert_eq!(cache.inner.get("key2").unwrap(), "value 2");
    }
}