use tokio_modbus::client::{Context, Reader, Writer};
use crate::error::HmPiError;

pub async fn read_hreg(ctx: &mut Context, address: u16) -> Result<u16, HmPiError> {
    match ctx.read_holding_registers(address, 1).await {
        Err(e) => Err(HmPiError::from(e)),
        Ok(r) => match r {
            Ok(r) => Ok(r[0]),
            Err(e) => Err(HmPiError::from(e))
        }
    }
}

pub async fn read_hregs(ctx: &mut Context, address: u16, count: u16) -> Result<Vec<u16>, HmPiError> {
    match ctx.read_holding_registers(address, count).await {
        Err(e) => Err(HmPiError::from(e)),
        Ok(r) => r.map_err(HmPiError::from)
    }
}

pub async fn write_hreg(ctx: &mut Context, address: u16, value: u16) -> Result<(), HmPiError> {
    match ctx.write_single_register(address, value).await {
        Err(e) => Err(HmPiError::from(e)),
        Ok(r) => r.map_err(HmPiError::from)
    }
}

pub async fn write_hregs(ctx: &mut Context, address: u16, values: &[u16]) -> Result<(), HmPiError> {
    match ctx.write_multiple_registers(address, values).await {
        Err(e) => Err(HmPiError::from(e)),
        Ok(r) => r.map_err(HmPiError::from)
    }
}