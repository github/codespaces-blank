use crate::headers::{
    quality::Ranked,
    HeaderValue
};

use std::{
    io::{Error, ErrorKind},
    str::FromStr,
    fmt
};

#[derive(Hash, Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum Encoding {
    Any,
    Identity,
    Brotli,
    Gzip,
    Deflate,
    Zstd
}

impl Encoding {
    /// Returns `true` is encoding is `*` (star)
    #[inline]
    pub(crate) fn is_any(&self) -> bool {
        self == &Encoding::Any
    }
}

impl Ranked for Encoding {
    #[inline]
    fn rank(&self) -> u8 {
        match self {
            Encoding::Brotli => 5,
            Encoding::Zstd => 4,
            Encoding::Gzip => 3,
            Encoding::Deflate => 2,
            Encoding::Any => 1,
            Encoding::Identity => 0,
        }
    }
}

impl FromStr for Encoding {
    type Err = Error;
    #[inline]
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "*" => Ok(Encoding::Any),
            "identity" => Ok(Encoding::Identity),
            "br" => Ok(Encoding::Brotli),
            "gzip" => Ok(Encoding::Gzip),
            "deflate" => Ok(Encoding::Deflate),
            "zstd" => Ok(Encoding::Zstd),
            _ => Err(EncodingError::unknown())
        }
    }
}

impl fmt::Display for Encoding {
    #[inline]
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        f.write_str(match *self { 
            Encoding::Any => "*",
            Encoding::Identity => "identity",
            Encoding::Brotli => "br",
            Encoding::Gzip => "gzip",
            Encoding::Deflate => "deflate",
            Encoding::Zstd => "zstd"
        })
    }
}

#[cfg(any(
    feature = "brotli",
    feature = "gzip",
    feature = "zstd",
    feature = "compression-full"
))]
impl From<Encoding> for HeaderValue {
    #[inline]
    fn from(encoding: Encoding) -> HeaderValue {
        HeaderValue::from_str(&encoding.to_string())
            .unwrap_or(HeaderValue::from_static("identity"))
    }
}

struct EncodingError;
impl EncodingError {
    fn unknown() -> Error { 
        Error::new(ErrorKind::InvalidInput, "Encoding error: Unknown encoding")
    }
}

#[cfg(test)]
mod tests {
    use std::str::FromStr;
    use crate::headers::HeaderValue;
    use crate::headers::quality::Ranked;
    use super::Encoding;
    
    #[test]
    fn it_parses_from_str() {
        let encodings = [
            ("*", Encoding::Any),
            ("identity", Encoding::Identity),
            ("br", Encoding::Brotli),
            ("gzip", Encoding::Gzip),
            ("deflate", Encoding::Deflate),
            ("zstd", Encoding::Zstd),
        ];
        
        for (encoding_str, encoding) in encodings {
            assert_eq!(Encoding::from_str(encoding_str).unwrap(), encoding);
        }
    }
    
    #[test]
    fn it_converts_to_str() {
        let encodings = [
            ("*", Encoding::Any),
            ("identity", Encoding::Identity),
            ("br", Encoding::Brotli),
            ("gzip", Encoding::Gzip),
            ("deflate", Encoding::Deflate),
            ("zstd", Encoding::Zstd),
        ];

        for (encoding_str, encoding) in encodings {
            assert_eq!(encoding.to_string(), encoding_str);
        }
    }
    
    #[test]
    fn it_returns_error() {
        let encoding_str = "abc";
        
        let encoding = Encoding::from_str(encoding_str);
        
        assert!(encoding.is_err());
    }
    
    #[test]
    fn it_returns_true_for_any_encoding() {
        assert!(Encoding::Any.is_any());
    }

    #[test]
    fn it_returns_false_for_other_encodings() {
        let encodings = [
            Encoding::Identity,
            Encoding::Brotli,
            Encoding::Gzip,
            Encoding::Deflate,
            Encoding::Zstd
        ];

        for encoding in &encodings {
            assert!(!encoding.is_any());
        }
    }
    
    #[test]
    fn it_converts_to_header_value() {
        let encodings = [
            Encoding::Any,
            Encoding::Identity,
            Encoding::Brotli,
            Encoding::Gzip,
            Encoding::Deflate,
            Encoding::Zstd
        ];

        for encoding in encodings {
            assert_eq!(HeaderValue::from(encoding), encoding.to_string());
        }
    }

    #[test]
    fn it_returns_correct_ranks() {
        let encodings = [
            Encoding::Identity,
            Encoding::Any,
            Encoding::Deflate,
            Encoding::Gzip,
            Encoding::Zstd,
            Encoding::Brotli,
        ];

        for (i, encoding) in encodings.iter().enumerate() {
            assert_eq!(i, encoding.rank() as usize);
        }
    }
}