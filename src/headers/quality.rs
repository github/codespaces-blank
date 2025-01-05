use std::{
    io::{Error, ErrorKind}, 
    num::ParseFloatError, 
    str::FromStr
};

/// Marks a struct as supporting q-factor
pub trait Ranked {
    /// Returns a struct default q-factor
    fn rank(&self) -> u8;
}

#[derive(Debug, Clone, Copy, PartialEq, PartialOrd)]
pub struct Quality<T: FromStr + Ranked> {
    pub item: T,
    pub value: f32,
}

impl<T: FromStr + Ranked> Quality<T> {
    const PREFIX: [&'static str; 2] = ["q=", "Q="];
    const DELIMITER: &'static str = ";";
    
    pub fn new(item: T, value: f32) -> Self {
        Quality { item, value }
    }
    
    #[inline]
    pub fn ranked(item: T) -> Self {
        let rank = item.rank() as f32;
        Quality::new(item, rank)
    }
}

impl<T: FromStr + Ranked> FromStr for Quality<T>
where 
    Error: From<<T as FromStr>::Err>
{
    type Err = Error;
    #[inline]
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let parts = s.rsplit_once(Self::DELIMITER)
            .map(|(item, q_val)| (item.trim(), q_val.trim()));
        
        if let Some((item, q_val)) = parts {
            let item = T::from_str(item)?;
            let q = &q_val[0..2];
            if Self::PREFIX.contains(&q) {
                let q_val = &q_val[2..];
                let value = q_val.parse::<f32>()
                    .map_err(QualityError::parsing_error)?;
                Ok(Quality::new(item, value))
            } else { 
                Ok(Quality::ranked(item))
            } 
        } else if let Ok(item) = T::from_str(s) {
            Ok(Quality::ranked(item))
        } else {
            Err(QualityError::missing_value())
        }
    }
}

struct QualityError;
impl QualityError {
    #[inline]
    fn parsing_error(err: ParseFloatError) -> Error {
        Error::new(ErrorKind::InvalidData, format!("Q-value error: {err}"))
    }

    #[inline]
    fn missing_value() -> Error {
        Error::new(ErrorKind::InvalidData, "Q-value error: missing value")
    }
}

#[cfg(test)]
mod tests {
    use std::str::FromStr;
    use super::{super::Encoding, Quality};
    #[cfg(feature = "gzip")]
    use crate::headers::quality::Ranked;

    #[test]
    #[cfg(feature = "brotli")]
    fn it_parses_from_str_with_value() {
        let str = "br;q=0.8";
        
        let quality = Quality::<Encoding>::from_str(str).unwrap();

        assert_eq!(quality.value, 0.8);
        assert_eq!(quality.item, Encoding::Brotli);
    }

    #[test]
    #[cfg(feature = "gzip")]
    fn it_parses_from_str_with_rank_value() {
        let str = "gzip";

        let quality = Quality::<Encoding>::from_str(str).unwrap();

        assert_eq!(quality.value, Encoding::Gzip.rank() as f32);
        assert_eq!(quality.item, Encoding::Gzip);
    }

    #[test]
    #[cfg(feature = "gzip")]
    fn it_returns_parse_error() {
        let str = "gzip;Q=";

        let quality = Quality::<Encoding>::from_str(str);

        assert!(quality.is_err());
    }

    #[test]
    fn it_returns_missing_value_error() {
        let str = "abc";

        let quality = Quality::<Encoding>::from_str(str);

        assert!(quality.is_err());
    }
}