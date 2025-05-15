use log::{info, warn};
use serde::Serialize;
use std::net::{IpAddr, Ipv4Addr, SocketAddr, TcpListener};
use crate::error::HmPiError;

mod modbus;
pub mod error;

pub const SOCKET_ADDR: SocketAddr = SocketAddr::new(IpAddr::V4(Ipv4Addr::new(127, 0, 0, 1)), 552);


#[tauri::command]
fn get_ip_addr() -> Result<String, String>  {
    match local_ip_address::local_ip() {
        Ok(ip) => {
            info!("Ip address: {:?}", ip);
            Ok(ip.to_string())
        },
        Err(e) => Err(HmPiError::from(e).to_string())
    }
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