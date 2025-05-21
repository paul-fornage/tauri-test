use crate::modbus::ConnectionState;
use std::net::SocketAddr;

pub struct AppState {
    pub(crate) connection_state: ConnectionState,
    pub(crate) target_socket_address: SocketAddr,
}
