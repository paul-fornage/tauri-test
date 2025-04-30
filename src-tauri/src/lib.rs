use log::{info, warn};
use std::net::IpAddr;
use tauri_plugin_log::{Target, TargetKind};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

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
        .plugin(tauri_plugin_log::Builder::new().build())
        .invoke_handler(tauri::generate_handler![greet, get_ip_addr])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
