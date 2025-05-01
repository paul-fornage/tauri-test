use log::{info, warn};
use serde::Serialize;
use std::net::{IpAddr, TcpListener};

#[tauri::command]
fn get_ip_addr() -> String {
    let ip = local_ip_address::local_ip().unwrap_or(IpAddr::V4([0, 0, 0, 0].into()));
    info!("Ip address: {:?}", ip);
    ip.to_string()
}



#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {


    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_tcp::init())
        .invoke_handler(tauri::generate_handler![
            get_ip_addr,
        ])


        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}