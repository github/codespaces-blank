use hyper::HeaderMap;
use hyper::header::{
    HeaderValue,
    ACCEPT, ACCEPT_CHARSET, ACCEPT_ENCODING, ACCEPT_LANGUAGE, ACCEPT_RANGES,
    ACCESS_CONTROL_ALLOW_CREDENTIALS, ACCESS_CONTROL_ALLOW_HEADERS, ACCESS_CONTROL_ALLOW_METHODS,
    ACCESS_CONTROL_ALLOW_ORIGIN, ACCESS_CONTROL_EXPOSE_HEADERS, ACCESS_CONTROL_MAX_AGE,
    ACCESS_CONTROL_REQUEST_HEADERS, ACCESS_CONTROL_REQUEST_METHOD, AGE, ALLOW, ALT_SVC,
    AUTHORIZATION, CACHE_CONTROL, CONNECTION, CONTENT_DISPOSITION, CONTENT_ENCODING,
    CONTENT_LANGUAGE, CONTENT_LENGTH, CONTENT_LOCATION, CONTENT_RANGE, CONTENT_SECURITY_POLICY,
    CONTENT_SECURITY_POLICY_REPORT_ONLY, CONTENT_TYPE, COOKIE, DATE, DNT, ETAG, EXPECT, EXPIRES,
    FORWARDED, FROM, HOST, IF_MATCH, IF_MODIFIED_SINCE, IF_NONE_MATCH, IF_RANGE,
    IF_UNMODIFIED_SINCE, LAST_MODIFIED, LINK, LOCATION, MAX_FORWARDS, ORIGIN, PRAGMA,
    PROXY_AUTHENTICATE, PROXY_AUTHORIZATION, PUBLIC_KEY_PINS, PUBLIC_KEY_PINS_REPORT_ONLY, RANGE,
    REFERER, REFERRER_POLICY, REFRESH, RETRY_AFTER, SEC_WEBSOCKET_ACCEPT, SEC_WEBSOCKET_EXTENSIONS,
    SEC_WEBSOCKET_KEY, SEC_WEBSOCKET_PROTOCOL, SEC_WEBSOCKET_VERSION, SERVER, SET_COOKIE,
    STRICT_TRANSPORT_SECURITY, TE, TRAILER, TRANSFER_ENCODING, UPGRADE, UPGRADE_INSECURE_REQUESTS,
    USER_AGENT, VARY, VIA, WARNING, WWW_AUTHENTICATE, X_CONTENT_TYPE_OPTIONS,
    X_DNS_PREFETCH_CONTROL, X_FRAME_OPTIONS, X_XSS_PROTECTION
};

use crate::app::endpoints::args::headers::FromHeaders;

macro_rules! define_header {
    ($(($struct_name:ident, $header_name:ident)),* $(,)?) => {
        $(
            pub struct $struct_name;

            impl FromHeaders for $struct_name {
                #[inline]
                fn from_headers(headers: &HeaderMap) -> &HeaderValue {
                    &headers[$header_name]
                }
            }
        )*
    };
}

define_header! {
    (Accept, ACCEPT), (AcceptCharset, ACCEPT_CHARSET), (AcceptEncoding, ACCEPT_ENCODING), (AcceptLanguage, ACCEPT_LANGUAGE), (AcceptRanges, ACCEPT_RANGES),
    (AccessControlAllowCredentials, ACCESS_CONTROL_ALLOW_CREDENTIALS), (AccessControlAllowHeaders, ACCESS_CONTROL_ALLOW_HEADERS),
    (AccessControlAllowMethods, ACCESS_CONTROL_ALLOW_METHODS), (AccessControlAllowOrigin, ACCESS_CONTROL_ALLOW_ORIGIN),
    (AccessControlAllowExposeHeaders, ACCESS_CONTROL_EXPOSE_HEADERS), (AccessControlAllowMaxAge, ACCESS_CONTROL_MAX_AGE),
    (AccessControlRequestHeaders, ACCESS_CONTROL_REQUEST_HEADERS), (AccessControlRequestMethod, ACCESS_CONTROL_REQUEST_METHOD), (Age, AGE), (Allow, ALLOW), (AltSvc, ALT_SVC),
    (Authorization, AUTHORIZATION), (CacheControl, CACHE_CONTROL), (Connection, CONNECTION), (ContentDisposition, CONTENT_DISPOSITION), (ContentEncoding, CONTENT_ENCODING),
    (ContentLanguage, CONTENT_LANGUAGE), (ContentLength, CONTENT_LENGTH), (ContentLocation, CONTENT_LOCATION), (ContentRange, CONTENT_RANGE), (ContentSecurityPolicy, CONTENT_SECURITY_POLICY),
    (ContentSecurityPolicyReportOnly, CONTENT_SECURITY_POLICY_REPORT_ONLY), (ContentType, CONTENT_TYPE), (Cookie, COOKIE), (Date, DATE), (Dnt, DNT), (Etag, ETAG), (Expect, EXPECT), (Expires, EXPIRES),
    (Forwarded, FORWARDED), (From, FROM), (Host, HOST), (IfMatch, IF_MATCH), (IfModifiedSince, IF_MODIFIED_SINCE), (IfNoneMatch, IF_NONE_MATCH), (IfRange, IF_RANGE),
    (IfUnmodifiedSince, IF_UNMODIFIED_SINCE), (LastModified, LAST_MODIFIED), (Link, LINK), (Location, LOCATION), (MaxForwards, MAX_FORWARDS), (Origin, ORIGIN), (Pragma, PRAGMA),
    (ProxyAuthenticate, PROXY_AUTHENTICATE), (ProxyAuthorization, PROXY_AUTHORIZATION), (PublicKeyPins, PUBLIC_KEY_PINS), (PublicKeyPinsReportOnly, PUBLIC_KEY_PINS_REPORT_ONLY), (Range, RANGE),
    (Referer, REFERER), (ReferrerPolicy, REFERRER_POLICY), (Refresh, REFRESH), (RetryAfter, RETRY_AFTER), (SecWebSocketAccept, SEC_WEBSOCKET_ACCEPT), (SecWebSocketExtensions, SEC_WEBSOCKET_EXTENSIONS),
    (SecWebSocketKey, SEC_WEBSOCKET_KEY), (SecWebSocketProtocol, SEC_WEBSOCKET_PROTOCOL), (SecWebSocketVersion, SEC_WEBSOCKET_VERSION), (Server, SERVER), (SetCookie, SET_COOKIE),
    (StrictTransportSecurity, STRICT_TRANSPORT_SECURITY), (Te, TE), (Trailer, TRAILER), (TransferEncoding, TRANSFER_ENCODING), (Upgrade, UPGRADE), (UpgradeInsecureRequests, UPGRADE_INSECURE_REQUESTS),
    (UserAgent, USER_AGENT), (Vary, VARY), (Via, VIA), (Warning, WARNING), (WwwAuthenticate, WWW_AUTHENTICATE), (XContentTypeOptions, X_CONTENT_TYPE_OPTIONS),
    (XDnsPrefetchControl, X_DNS_PREFETCH_CONTROL), (XFrameOptions, X_FRAME_OPTIONS), (XXssProtection, X_XSS_PROTECTION)
}
