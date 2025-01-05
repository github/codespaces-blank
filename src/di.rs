//! Tools for Dependency Injection

use super::App;
use std::io::{Error, ErrorKind};

pub use self::{
    container::{Container, ContainerBuilder},
    dc::Dc,
    inject::Inject,
};

pub mod dc;
pub mod inject;
pub mod container;

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
    /// Registers singleton service
    /// 
    /// # Example
    /// ```no_run
    /// use volga::App;
    /// 
    /// #[derive(Default, Clone)]
    /// struct Singleton;
    /// 
    /// let mut app = App::new();
    /// let singleton = Singleton::default();
    /// app.add_singleton(singleton);
    /// ```
    pub fn add_singleton<T: Inject + 'static>(&mut self, instance: T) -> &mut Self {
        self.container.register_singleton(instance);
        self
    }

    /// Registers scoped service
    ///
    /// # Example
    /// ```no_run
    /// use volga::App;
    ///
    /// #[derive(Default, Clone)]
    /// struct ScopedService;
    ///
    /// let mut app = App::new();
    /// app.add_scoped::<ScopedService>();
    /// ```
    pub fn add_scoped<T: Inject + 'static>(&mut self) -> &mut Self {
        self.container.register_scoped::<T>();
        self
    }

    /// Registers transient service
    ///
    /// # Example
    /// ```no_run
    /// use volga::App;
    ///
    /// #[derive(Default, Clone)]
    /// struct TransientService;
    ///
    /// let mut app = App::new();
    /// app.add_transient::<TransientService>();
    /// ```
    pub fn add_transient<T: Inject + 'static>(&mut self) -> &mut Self {
        self.container.register_transient::<T>();
        self
    }
}
