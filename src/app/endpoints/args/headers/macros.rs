/// Declares a custom HTTP headers
///
/// # Example
/// ```rust
/// use volga::headers::custom_headers;
///
/// // The `x-api-key` header
/// custom_headers! {
///     (ApiKey, "x-api-key")
/// }
/// ```
#[macro_export]
macro_rules! custom_headers {
    ($(($struct_name:ident, $header_name:expr)),* $(,)?) => {
        $(
            pub struct $struct_name;

            impl $crate::app::endpoints::args::headers::FromHeaders for $struct_name {
                #[inline]
                fn from_headers(headers: &hyper::HeaderMap) -> Option<&hyper::header::HeaderValue> {
                    headers.get($header_name)
                }
                
                #[inline]
                fn header_type() -> &'static str {
                    $header_name
                }
            }
        )*
    };
}

pub use custom_headers;

#[cfg(test)]
#[allow(unreachable_pub)]
mod test {
    use hyper::header::HeaderValue;
    use hyper::HeaderMap;
    use crate::headers::{Header, custom_headers};

    custom_headers! {
        (ApiKey, "x-api-key")
    }
    
    #[test]
    fn it_creates_custom_headers() {
        let api_key = HeaderValue::from_str("some-api-key").unwrap();
        let api_key_header = Header::<ApiKey>::new(&api_key);
        
        assert_eq!(api_key_header.value, "some-api-key")
    }

    #[test]
    fn it_gets_custom_headers_from_map() {
        let api_key = HeaderValue::from_str("some-api-key").unwrap();
        
        let mut map = HeaderMap::new();
        map.insert("x-api-key", api_key);
        
        let api_key_header = Header::<ApiKey>::from_headers_map(&map).unwrap();

        assert_eq!(*api_key_header, "some-api-key")
    }
}