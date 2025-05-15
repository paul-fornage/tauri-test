use tokio_modbus::client::{self, tcp, Client, Reader};
use crate::SOCKET_ADDR;
use log::{info, warn};
pub mod commands;
mod connection_state;

async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut ctx: client::Context = tcp::connect(SOCKET_ADDR).await?;

    println!("Fetching the coupler ID");
    let data = ctx.read_input_registers(0x1000, 7).await??;

    let bytes: Vec<u8> = data.iter().fold(vec![], |mut x, elem| {
        x.push((elem & 0xff) as u8);
        x.push((elem >> 8) as u8);
        x
    });
    let id = String::from_utf8(bytes).unwrap();
    println!("The coupler ID is '{id}'");

    println!("Disconnecting");
    ctx.disconnect().await?;

    Ok(())
}