use crate::di::Container;

use std::{io::Error, future::Future};
use futures_util::future::ok;

/// A trait that adds the ability to inject dependencies when resolving a type from the DI container
///
/// If there is no need to inject other dependencies the `struct` must implement the `Default` trait
///
/// # Example
/// ```no_run
/// use volga::{App, di::Dc, ok};
///
/// #[derive(Default, Clone)]
/// struct ScopedService;
///
/// let mut app = App::new();
/// app.add_scoped::<ScopedService>();
///
/// app.map_get("/route", |scoped_service: Dc<ScopedService>| async move {
///     // Do something with scoped service
///     ok!()
/// });
/// ```
///
/// If it's required to construct a `struct` from other dependencies, the `Inject` can be implemented manually
///
/// # Example
/// ```no_run
/// use std::io::Error;
/// use volga::{
///     App,
///     di::{Dc, Inject, Container},
///     ok
/// };
///
/// #[derive(Default, Clone)]
/// struct ScopedService;
///
/// #[derive(Clone)]
/// struct TransientService {
///     service: ScopedService 
/// }
///
/// impl Inject for TransientService {
///     async fn inject(container: &mut Container) -> Result<Self, Error> {
///         let scoped_service = container.resolve::<ScopedService>().await?;
///         Ok(Self { service: scoped_service })
///     }
/// }
///
/// let mut app = App::new();
/// app.add_scoped::<ScopedService>();
/// app.add_transient::<TransientService>();
///
/// app.map_get("/route", |transient_service: Dc<TransientService>| async move {
///     let scoped = &transient_service.service;
///     // Do something with scoped and/or transient service
///     ok!()
/// });
/// ```
pub trait Inject: Clone + Send + Sync {
    fn inject(container: &mut Container) -> impl Future<Output = Result<Self, Error>> + Send;
}

impl<T: Default + Clone + Send + Sync> Inject for T {
    fn inject(_: &mut Container) -> impl Future<Output = Result<Self, Error>> + Send {
        ok(Self::default())
    }
}
