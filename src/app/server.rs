use hyper_util::rt::TokioIo;
use tokio::net::TcpStream;

#[cfg(all(feature = "http1", not(feature = "http2")))]
pub(super) mod http1;
#[cfg(any(
    all(feature = "http1", feature = "http2"),
    all(feature = "http2", not(feature = "http1"))
))]
pub(super) mod http2;

pub(super) struct Server {
    io: TokioIo<TcpStream>
}