
use thiserror::Error;

#[derive(Error, Debug)]
pub enum HmPiError {
    #[error("Modbus Error: {0:?}")]
    ModbusError(#[from] tokio_modbus::Error),
    #[error("Modbus Exception: {0:?}")]
    ModbusException(#[from] tokio_modbus::ExceptionCode),
}