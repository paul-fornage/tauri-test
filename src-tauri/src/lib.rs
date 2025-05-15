use std::convert::Infallible;
use log::{info, warn};
use serde::Serialize;
use std::net::{IpAddr, Ipv4Addr, SocketAddr};
use std::time::Duration;
use crate::error::HmPiError;
use tauri::{Manager, State};
use crate::modbus::ConnectionState;
use tokio::sync::{Mutex, MutexGuard};
use tokio_modbus::client::Context;
use crate::app_state::AppState;

mod modbus;
pub mod error;
mod app_state;

pub const DEFAULT_SOCKET_ADDR: SocketAddr = SocketAddr::new(IpAddr::V4(Ipv4Addr::new(127, 0, 0, 1)), 552);
pub const STATE_MUTEX_TIMOUT: Duration = Duration::new(0, 100_000_000); // 100ms


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



#[tauri::command]
async fn get_connection_state_name(state: State<'_, Mutex<AppState>>) -> Result<&'static str, String> {
    match tokio::time::timeout(STATE_MUTEX_TIMOUT, state.lock()).await {
        Ok(state) => {
            Ok(state.connection_state.state_name())
        },
        Err(_) => {
            warn!("Timeout while getting connection state");
            Err(HmPiError::ModbusLockTimeout.to_string())
        }
    }
}

#[tauri::command]
async fn get_connected_socket_addr(state: State<'_, Mutex<AppState>>) -> Result<String, String> {
    match tokio::time::timeout(STATE_MUTEX_TIMOUT, state.lock()).await {
        Ok(state) => {
            match state.connection_state {
                ConnectionState::Connected(_, addr) => {
                    Ok(addr.to_string())
                }
                _ => Err("Not connected to any socket".to_string())
            }
        },
        Err(_) => {
            warn!("Timeout while getting connection state");
            Err(HmPiError::ModbusLockTimeout.to_string())
        }
    }
}

#[tauri::command]
async fn get_connection_state_info(state: State<'_, Mutex<AppState>>) -> Result<String, String> {
    match tokio::time::timeout(STATE_MUTEX_TIMOUT, state.lock()).await {
        Ok(state) => {
            match state.connection_state {
                ConnectionState::Connected(_, addr) => {
                    Ok(format!("Connected to {addr:?}"))
                }
                ConnectionState::Disconnected => {
                    Ok("Disconnected".to_string())
                }
                ConnectionState::Error => {
                    Ok("Error".to_string())
                }
            }
        },
        Err(_) => {
            warn!("Timeout while getting connection state");
            Err(HmPiError::ModbusLockTimeout.to_string())
        }
    }
}

#[tauri::command]
async fn reset_connection(state: State<'_, Mutex<AppState>>) -> Result<(), String> {
    match tokio::time::timeout(STATE_MUTEX_TIMOUT, state.lock()).await {
        Ok(mut state_guard) => {
            let target_socket_address = state_guard.target_socket_address;
            state_guard.connection_state.reset(target_socket_address).await.map_err(|e| e.to_string())
        },
        Err(_) => {
            warn!("Timeout while getting connection state");
            Err(HmPiError::ModbusLockTimeout.to_string())
        }
    }
}


#[tauri::command]
async fn read_hreg(state: State<'_, Mutex<AppState>>, address: u16) -> Result<u16, String> {
    
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            app.manage(Mutex::new(AppState{
                connection_state: ConnectionState::Disconnected,
                target_socket_address: DEFAULT_SOCKET_ADDR,
            }));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_ip_addr,
            get_connection_state_str,
            my_custom_command,
        ])
        
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}