use log::warn;
use crate::error::HmPiError;
use crate::modbus::ConnectionState;
use tokio_modbus::client::{Context, Reader, Writer};

fn is_transport_error(e: &tokio_modbus::Error) -> bool {
    match e {
        tokio_modbus::Error::Transport(_) => true,
        _ => false
    }
}


impl ConnectionState{
    
    fn unwrap_connected(&mut self) -> Result<&mut Context, HmPiError> {
        match self {
            ConnectionState::Connected(ctx, _) => { Ok(ctx) },
            ConnectionState::Disconnected => {Err(HmPiError::ModbusDisconnectedState)}
            ConnectionState::Error => {Err(HmPiError::ModbusErrorState)}
        }
    }

    
    /// Unwraps a modbus result and converts it to a HmPiError
    /// Mutates self to error state if a transport error occurs.
    /// Transport errors likely mean the connection is not working anyway and should be closed.
    fn modbus_result_unwrapper<T>(&mut self, res: tokio_modbus::Result<T>) -> Result<T, HmPiError> {
        match res {
            Err(e) => {
                if is_transport_error(&e) {
                    warn!("Transport error: {e}\
                               \nThis likely means the instance is faulty or not connected");
                    *self = ConnectionState::Error;
                }
                Err(HmPiError::from(e))
            },
            Ok(r) => r.map_err(HmPiError::from)
        }
    }
    
    pub async fn read_hreg(&mut self, address: u16) -> Result<u16, HmPiError> {
        let res = self.unwrap_connected()?.read_holding_registers(address, 1).await;
        self.modbus_result_unwrapper(res).map(|r| r[0])
    }

    pub async fn read_hregs(&mut self, address: u16, count: u16) -> Result<Vec<u16>, HmPiError> {
        let res = self.unwrap_connected()?.read_holding_registers(address, count).await;
        self.modbus_result_unwrapper(res)
    }

    pub async fn write_hreg(&mut self, address: u16, value: u16) -> Result<(), HmPiError> {
        let res = self.unwrap_connected()?.write_single_register(address, value).await;
        self.modbus_result_unwrapper(res)
    }

    pub async fn write_hregs(&mut self, address: u16, values: &[u16]) -> Result<(), HmPiError> {
        let res = self.unwrap_connected()?.write_multiple_registers(address, values).await;
        self.modbus_result_unwrapper(res)
    }

    pub async fn read_coil(&mut self, address: u16) -> Result<bool, HmPiError> {
        let res = self.unwrap_connected()?.read_coils(address, 1).await;
        self.modbus_result_unwrapper(res).map(|r| r[0])
    }

    pub async fn read_coils(&mut self, address: u16, count: u16) -> Result<Vec<bool>, HmPiError> {
        let res = self.unwrap_connected()?.read_coils(address, count).await;
        self.modbus_result_unwrapper(res)
    }

    pub async fn write_coil(&mut self, address: u16, value: bool) -> Result<(), HmPiError> {
        let res = self.unwrap_connected()?.write_single_coil(address, value).await;
        self.modbus_result_unwrapper(res)
    }

    pub async fn write_coils(&mut self, address: u16, values: &[bool]) -> Result<(), HmPiError> {
        let res = self.unwrap_connected()?.write_multiple_coils(address, values).await;
        self.modbus_result_unwrapper(res)
    }
}


