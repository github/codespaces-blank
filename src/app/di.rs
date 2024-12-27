use crate::App;
use std::{
    io::{Error, ErrorKind},
    collections::HashMap,
    any::{Any, TypeId},
    sync::Arc
};

/// Marks a type that can be used with DI
pub trait Inject: Clone + Send + Sync {
    fn inject(container: &mut Container) -> Result<Self, Error>;
}
impl<T: Default + Clone + Send + Sync> Inject for T {
    fn inject(_: &mut Container) -> Result<Self, Error> {
        Ok(Self::default())
    }
}

type ArcService = Arc<
    dyn Any 
    + Send 
    + Sync
>;

pub(super) enum ServiceEntry {
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

/// Represents a DI containers
pub struct Container {
    services: HashMap<TypeId, ServiceEntry>
}

impl Clone for Container {
    fn clone(&self) -> Self {
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
}

impl Container {
    /// Resolve a service
    pub fn resolve<T: Inject + 'static>(&mut self) -> Result<T, Error> {
        let type_id = TypeId::of::<T>();
        let entry = self.services.get(&type_id);
        if entry.is_none() {
            return Err(DiError::service_not_registered(std::any::type_name::<T>()));
        }
        if let Some(service_entry) = entry {
            return match service_entry {
                ServiceEntry::Transient => T::inject(self),
                ServiceEntry::Singleton(instance) => Self::resolve_internal(instance),
                ServiceEntry::Scoped(maybe_instance) => {
                    if let Some(instance) = maybe_instance {
                        Self::resolve_internal(instance)
                    } else {
                        self.register_scoped(type_id)
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
    fn register_scoped<T: Inject + 'static>(&mut self, type_id: TypeId) -> Result<T, Error> {
        let new_instance = T::inject(self)?;
        let clone = new_instance.clone();
        let entry = ServiceEntry::Scoped(Some(Arc::new(new_instance)));
        self.services.insert(type_id, entry);
        Ok(clone)
    }
}

struct DiError;

impl DiError {
    fn service_not_registered(type_name: &str) -> Error {
        Error::new(ErrorKind::Other, format!("Services Error: service not registered: {}", type_name))
    }

    fn resolve_error(type_name: &str) -> Error {
        Error::new(ErrorKind::Other, format!("Services Error: unable to resolve the service: {}", type_name))
    }
}

/// DI specific impl for [`App`]
impl App {
    pub fn add_singleton<T: Inject + 'static>(&mut self, instance: T) {
        self.container.register_singleton(instance);
    }

    pub fn add_scoped<T: Inject + 'static>(&mut self) {
        self.container.register_scoped::<T>();
    }

    pub fn add_transient<T: Inject + 'static>(&mut self) {
        self.container.register_transient::<T>();
    }
}

#[cfg(test)]
mod tests {
    use std::collections::HashMap;
    use std::io::Error;
    use std::sync::{Arc, Mutex};
    use super::{Inject, Container, ContainerBuilder};

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
        fn inject(container: &mut Container) -> Result<Self, Error> {
            Ok(Self { inner: container.resolve()? })
        }
    }

    #[test]
    fn it_registers_singleton() {
        let mut container = ContainerBuilder::new();
        container.register_singleton(InMemoryCache::default());
        
        let mut container = container.build();
        
        let cache = container.resolve::<InMemoryCache>().unwrap();
        cache.set("key", "value");

        let cache = container.resolve::<InMemoryCache>().unwrap();
        let key = cache.get("key").unwrap();
        
        assert_eq!(key, "value");
    }

    #[test]
    fn it_registers_transient() {
        let mut container = ContainerBuilder::new();
        container.register_transient::<InMemoryCache>();

        let mut container = container.build();

        let cache = container.resolve::<InMemoryCache>().unwrap();
        cache.set("key", "value");

        let cache = container.resolve::<InMemoryCache>().unwrap();
        let key = cache.get("key");

        assert!(key.is_none());
    }

    #[test]
    fn it_registers_scoped() {
        let mut container = ContainerBuilder::new();
        container.register_scoped::<InMemoryCache>();

        let mut container = container.build();
        
        // working in the initial scope
        let cache = container.resolve::<InMemoryCache>().unwrap();
        cache.set("key", "value 1");

        // create a new scope so new instance of InMemoryCache will be created
        {
            let mut scope = container.clone();
            let cache = scope.resolve::<InMemoryCache>().unwrap();
            cache.set("key", "value 2");

            let cache = scope.resolve::<InMemoryCache>().unwrap();
            let key = cache.get("key").unwrap();

            assert_eq!(key, "value 2");
        }

        // create a new scope so new instance of InMemoryCache will be created
        {
            let mut scope = container.clone();
            let cache = scope.resolve::<InMemoryCache>().unwrap();
            let key = cache.get("key");

            assert!(key.is_none());
        }

        let key = cache.get("key").unwrap();

        assert_eq!(key, "value 1");
    }
    
    #[test]
    fn it_resolves_inner_dependencies() {
        let mut container = ContainerBuilder::new();
        
        container.register_singleton(InMemoryCache::default());
        container.register_scoped::<CacheWrapper>();
        
        let mut container = container.build();

        {
            let mut scope = container.clone();
            let cache = scope.resolve::<CacheWrapper>().unwrap();
            cache.inner.set("key", "value 1");
        }
        
        let cache = container.resolve::<InMemoryCache>().unwrap();
        let key = cache.get("key").unwrap();

        assert_eq!(key, "value 1");
    }
}