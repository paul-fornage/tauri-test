use log::{info, warn};
use serde::Serialize;
use std::net::{IpAddr, Ipv4Addr, SocketAddr, TcpListener};
mod modbus;
pub mod error;

const SOCKET_ADDR: SocketAddr = SocketAddr::new(IpAddr::V4(Ipv4Addr::new(127, 0, 0, 1)), 552);


#[tauri::command]
fn get_ip_addr() -> String {
    let ip = local_ip_address::local_ip().unwrap_or(IpAddr::V4([0, 0, 0, 0].into()));
    info!("Ip address: {:?}", ip);
    ip.to_string()
}

#[tauri::command]
async fn my_custom_command(value: &str) -> Result<String, ()> {
    use tokio_modbus::prelude::*;
    // Call another async function and wait for it to finish
    
    // Note that the return value must be wrapped in `Ok()` now.
    Ok(format!("{}", value))
}



#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_ip_addr,
            my_custom_command,
        ])
        
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}