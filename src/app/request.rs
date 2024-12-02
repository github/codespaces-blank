use hyper::Request;
use hyper::body::Incoming;

pub type HttpRequest = Request<Incoming>;