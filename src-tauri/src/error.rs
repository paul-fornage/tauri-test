use thiserror::Error;

#[derive(Error, Debug)]
pub enum HmPiError {
    #[error("Modbus Error: {0:?}")]
    ModbusError(#[from] tokio_modbus::Error),
    #[error("Modbus Exception: {0:?}")]
    ModbusException(#[from] tokio_modbus::ExceptionCode),
    #[error("Local IP error: {0:?}")]
    LocalIpError(#[from] local_ip_address::Error),
    #[error("IO error: {0:?}")]
    IoError(#[from] std::io::Error),
    #[error("Tried modbus operation while disconnected")]
    ModbusDisconnectedState,
    #[error("Tried modbus operation while in error state")]
    ModbusErrorState,
    #[error("Tried to connect to modbus device while already connected")]
    ModbusAlreadyConnected,
    #[error("Timed out waiting for lock on modbus connection context")]
    ModbusLockTimeout,
    #[error("Timed out waiting for modbus operation to complete")]
    ModbusOpTimeout,
}

impl HmPiError {
    pub fn requires_reconnect(&self) -> bool {
        match self {
            HmPiError::ModbusDisconnectedState => true,
            HmPiError::ModbusErrorState => true,
            HmPiError::IoError(_) => true, // currently only connection requests can produce this error variant
            HmPiError::ModbusError(e) => match e {
                tokio_modbus::Error::Protocol(_) => false, // A response was received, but it was no good. This does not require reconnecting TCP
                tokio_modbus::Error::Transport(_) => true, // An error in TCP occurred. This requires reconnecting TCP.
                                                           // TODO: check for IO errors, some, like `PermissionDenied`,
                                                           //      or `AddrInUse` will never be fixed by reconnecting the TCP socket
            },
            _ => false,
        }
    }
}
