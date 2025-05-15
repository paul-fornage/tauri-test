use std::net::{SocketAddr};
use crate::modbus::ConnectionState;

pub struct AppState {
    pub(crate) connection_state: ConnectionState,
    pub(crate) target_socket_address: SocketAddr,
}