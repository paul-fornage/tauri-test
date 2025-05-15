use tokio_modbus::client::{Context, Reader};
use crate::error::HmPiError;


pub async fn read_hreg(ctx: &mut Context, address: u16) -> Result<u16, HmPiError> {
    match ctx.read_input_registers(address, 1).await {
        Err(e) => Err(HmPiError::from(e)),
        Ok(r) => match r {
            Ok(r) => Ok(r[0]),
            Err(e) => Err(HmPiError::from(e))
        }
    }
}

pub async fn read_hregs(ctx: &mut Context, address: u16, count: u16) -> Result<Vec<u16>, HmPiError> {
    match ctx.read_input_registers(address, count).await {
        Err(e) => Err(HmPiError::from(e)),
        Ok(r) => match r {
            Ok(regs) => Ok(regs),
            Err(e) => Err(HmPiError::from(e))
        }
    }
}