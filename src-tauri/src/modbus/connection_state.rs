use std::net::IpAddr;
use tokio_modbus::client::Context;
pub enum ConnectionState {
    Connected(Context, IpAddr),
    Disconnected,
    Error,
}