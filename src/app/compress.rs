//! Compression middleware
//! 
//! Middleware that compress HTTP response body

use std::{
    collections::HashSet,
    cmp::Ordering,
    str::FromStr,
};

#[cfg(feature = "brotli")]
use async_compression::tokio::bufread::BrotliEncoder;

#[cfg(feature = "gzip")]
use async_compression::tokio::bufread::{ZlibEncoder, GzipEncoder};

#[cfg(feature = "zstd")]
use async_compression::tokio::bufread::ZstdEncoder;

use async_compression::Level;
use futures_util::TryStreamExt;
use http_body_util::{BodyExt, StreamBody};
use hyper::body::Frame;

use tokio_util::io::{
    ReaderStream, 
    StreamReader
};

use super::App;
use crate::{
    headers::{
        quality::Quality,
        HeaderValue,
        ACCEPT_ENCODING,
        ACCEPT_RANGES,
        CONTENT_ENCODING,
        CONTENT_LENGTH,
        VARY
    },
    encoding::Encoding,
    HttpResponse,
    HttpResult,
    BoxBody,
    status
};

static SUPPORTED_ENCODINGS: &[Encoding] = &[
    Encoding::Identity,
    #[cfg(feature = "brotli")]
    Encoding::Brotli,
    #[cfg(feature = "gzip")]
    Encoding::Gzip,
    #[cfg(feature = "gzip")]
    Encoding::Deflate,
    #[cfg(feature = "zstd")]
    Encoding::Zstd,
];

trait Compressor {
    fn compress(body: BoxBody) -> BoxBody;
}

#[cfg(feature = "gzip")]
struct GzipCompressor;
#[cfg(feature = "gzip")]
impl Compressor for GzipCompressor {
    fn compress(body: BoxBody) -> BoxBody {
        let body_stream = body.into_data_stream();
        let stream_reader = StreamReader::new(body_stream);

        let encoder = GzipEncoder::new(stream_reader);
        let compressed_body = ReaderStream::new(encoder);
        StreamBody::new(compressed_body.map_ok(Frame::data)).boxed()
    }
}

#[cfg(feature = "gzip")]
struct DeflateCompressor;
#[cfg(feature = "gzip")]
impl Compressor for DeflateCompressor {
    fn compress(body: BoxBody) -> BoxBody {
        let body_stream = body.into_data_stream();
        let stream_reader = StreamReader::new(body_stream);

        let encoder = ZlibEncoder::new(stream_reader);
        let compressed_body = ReaderStream::new(encoder);
        StreamBody::new(compressed_body.map_ok(Frame::data)).boxed()
    }
}

#[cfg(feature = "brotli")]
struct BrotliCompressor;
#[cfg(feature = "brotli")]
impl Compressor for BrotliCompressor {
    fn compress(body: BoxBody) -> BoxBody {
        let body_stream = body.into_data_stream();
        let stream_reader = StreamReader::new(body_stream);

        let encoder = BrotliEncoder::with_quality(stream_reader, Level::Precise(4));
        let compressed_body = ReaderStream::new(encoder);
        StreamBody::new(compressed_body.map_ok(Frame::data)).boxed()
    }
}

#[cfg(feature = "zstd")]
struct ZstdCompressor;
#[cfg(feature = "zstd")]
impl Compressor for ZstdCompressor {
    fn compress(body: BoxBody) -> BoxBody {
        let body_stream = body.into_data_stream();
        let stream_reader = StreamReader::new(body_stream);

        let encoder = ZstdEncoder::new(stream_reader);
        let compressed_body = ReaderStream::new(encoder);
        StreamBody::new(compressed_body.map_ok(Frame::data)).boxed()
    }
}

impl App {
    /// Registers a middleware that applies a default compression algorithm
    pub fn use_compression(&mut self) -> &mut Self {
        self.use_middleware(|ctx, next| async move {
            let accept_encoding = ctx.request
                .headers()
                .get(&ACCEPT_ENCODING)
                .cloned();
            let http_result = next(ctx).await;

            Self::negotiate(accept_encoding, http_result)
        });
        self
    }
    
    fn negotiate(accept_encoding: Option<HeaderValue>, http_result: HttpResult) -> HttpResult {
        let accept_encoding = accept_encoding
            .map(|val| val.to_str().unwrap_or("").to_string());
        
        let mut encodings_with_weights = vec![];
        if let Some(header_value) = &accept_encoding {
            for part in header_value.split(',') {
                let quality = Quality::<Encoding>::from_str(part.trim())?;
                encodings_with_weights.push(quality);
            }
            encodings_with_weights
                .sort_by(|a, b| b.value
                    .partial_cmp(&a.value)
                    .unwrap_or(Ordering::Equal)
                );
        }
        
        let supported = SUPPORTED_ENCODINGS
            .iter()
            .collect::<HashSet<_>>();
        
        if encodings_with_weights.is_empty() || encodings_with_weights[0].item.is_any() {
            return if supported.contains(&Encoding::Brotli) {
                Self::brotli(http_result)
            } else if supported.contains(&Encoding::Gzip) {
                Self::gzip(http_result)
            } else {
                http_result
            }
        }

        for encoding in encodings_with_weights {
            if supported.contains(&encoding.item) { 
                return Self::compress(encoding.item, http_result);
            }
        }
        
        let supported_encodings_str = supported
            .iter()
            .map(|&encoding| encoding.to_string())
            .collect::<Vec<String>>()
            .join(",");
        
        status!(
            406, 
            supported_encodings_str, 
            [(VARY, ACCEPT_ENCODING)]
        )
    }

    fn compress(encoding: Encoding, http_result: HttpResult) -> HttpResult {
        match encoding {
            #[cfg(feature = "brotli")]
            Encoding::Brotli => Self::brotli(http_result),
            #[cfg(feature = "gzip")]
            Encoding::Gzip => Self::gzip(http_result),
            #[cfg(feature = "gzip")]
            Encoding::Deflate => Self::deflate(http_result),
            #[cfg(feature = "zstd")]
            Encoding::Zstd => Self::zstd(http_result),
            _ => http_result
        }
    }

    /// Registers a middleware that applies gzip compression algorithm
    #[cfg(feature = "gzip")]
    fn gzip(http_result: HttpResult) -> HttpResult {
        if let Ok(response) = http_result {
            let (mut parts, body) = response.into_parts();
            parts.headers.remove(CONTENT_LENGTH);
            parts.headers.remove(ACCEPT_RANGES);
            parts.headers.append(
                CONTENT_ENCODING,
                Encoding::Gzip.into()
            );
            let body = GzipCompressor::compress(body);
            Ok(HttpResponse::from_parts(parts, body))
        } else {
            http_result
        }
    }

    /// Registers a middleware that applies a deflate compression algorithm
    #[cfg(feature = "gzip")]
    fn deflate(http_result: HttpResult) -> HttpResult {
        if let Ok(response) = http_result {
            let (mut parts, body) = response.into_parts();
            parts.headers.remove(CONTENT_LENGTH);
            parts.headers.remove(ACCEPT_RANGES);
            parts.headers.append(
                CONTENT_ENCODING,
                Encoding::Deflate.into()
            );
            let body = DeflateCompressor::compress(body);
            Ok(HttpResponse::from_parts(parts, body))
        } else {
            http_result
        }
    }

    /// Registers a middleware that applies brotli compression algorithm
    #[cfg(feature = "brotli")]
    fn brotli(http_result: HttpResult) -> HttpResult {
        if let Ok(response) = http_result {
            let (mut parts, body) = response.into_parts();
            parts.headers.remove(CONTENT_LENGTH);
            parts.headers.remove(ACCEPT_RANGES);
            parts.headers.append(
                CONTENT_ENCODING,
                Encoding::Brotli.into()
            );
            let body = BrotliCompressor::compress(body);
            Ok(HttpResponse::from_parts(parts, body))
        } else {
            http_result
        }
    }

    /// Registers a middleware that applies Zstandard compression algorithm
    #[cfg(feature = "zstd")]
    fn zstd(http_result: HttpResult) -> HttpResult {
        if let Ok(response) = http_result {
            let (mut parts, body) = response.into_parts();
            parts.headers.remove(CONTENT_LENGTH);
            parts.headers.remove(ACCEPT_RANGES);
            parts.headers.append(
                CONTENT_ENCODING,
                Encoding::Zstd.into()
            );
            let body = ZstdCompressor::compress(body);
            Ok(HttpResponse::from_parts(parts, body))
        } else {
            http_result
        }
    }
}
