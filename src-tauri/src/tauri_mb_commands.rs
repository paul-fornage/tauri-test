use log::warn;
use tauri::{State};
use tokio::sync::Mutex;
use crate::app_state::AppState;
use crate::error::HmPiError;
use crate::STATE_MUTEX_TIMOUT;

#[tauri::command]
pub async fn read_hreg(state: State<'_, Mutex<AppState>>, address: u16) -> Result<u16, String> {
    match tokio::time::timeout(STATE_MUTEX_TIMOUT, state.lock()).await {
        Ok(mut state_guard) => {
            state_guard.connection_state.read_hreg(address).await.map_err(|e| {
                warn!("Error while reading hreg at address {address}: {}", e);
                if e.requires_reconnect() {
                    warn!("Error is not recoverable without reconnecting");
                }
                e.to_string()
            })
        },
        Err(_) => {
            warn!("Timeout while getting connection state");
            Err(HmPiError::ModbusLockTimeout.to_string())
        }
    }
}


#[tauri::command]
pub async fn read_hregs(state: State<'_, Mutex<AppState>>, address: u16, count: u16) -> Result<Vec<u16>, String> {
    match tokio::time::timeout(STATE_MUTEX_TIMOUT, state.lock()).await {
        Ok(mut state_guard) => {
            state_guard.connection_state.read_hregs(address, count).await.map_err(|e| {
                warn!("Error while reading hregs from address {address} with count {count}: {}", e);
                if e.requires_reconnect() {
                    warn!("Error is not recoverable without reconnecting");
                }
                e.to_string()
            })
        },
        Err(_) => {
            warn!("Timeout while getting connection state");
            Err(HmPiError::ModbusLockTimeout.to_string())
        }
    }
}

#[tauri::command]
pub async fn write_hreg(state: State<'_, Mutex<AppState>>, address: u16, value: u16) -> Result<(), String> {
    match tokio::time::timeout(STATE_MUTEX_TIMOUT, state.lock()).await {
        Ok(mut state_guard) => {
            state_guard.connection_state.write_hreg(address, value).await.map_err(|e| {
                warn!("Error while writing hreg at address {address} with value {value}: {}", e);
                if e.requires_reconnect() {
                    warn!("Error is not recoverable without reconnecting");
                }
                e.to_string()
            })
        },
        Err(_) => {
            warn!("Timeout while getting connection state");
            Err(HmPiError::ModbusLockTimeout.to_string())
        }
    }
}

#[tauri::command]
pub async fn write_hregs(state: State<'_, Mutex<AppState>>, address: u16, values: Vec<u16>) -> Result<(), String> {
    match tokio::time::timeout(STATE_MUTEX_TIMOUT, state.lock()).await {
        Ok(mut state_guard) => {
            state_guard.connection_state.write_hregs(address, &values).await.map_err(|e| {
                warn!("Error while writing hregs at address {address} with values {:?}: {}", values, e);
                if e.requires_reconnect() {
                    warn!("Error is not recoverable without reconnecting");
                }
                e.to_string()
            })
        },
        Err(_) => {
            warn!("Timeout while getting connection state");
            Err(HmPiError::ModbusLockTimeout.to_string())
        }
    }
}

#[tauri::command]
pub async fn read_coil(state: State<'_, Mutex<AppState>>, address: u16) -> Result<bool, String> {
    match tokio::time::timeout(STATE_MUTEX_TIMOUT, state.lock()).await {
        Ok(mut state_guard) => {
            state_guard.connection_state.read_coil(address).await.map_err(|e| {
                warn!("Error while reading coil at address {address}: {}", e);
                if e.requires_reconnect() {
                    warn!("Error is not recoverable without reconnecting");
                }
                e.to_string()
            })
        },
        Err(_) => {
            warn!("Timeout while getting connection state");
            Err(HmPiError::ModbusLockTimeout.to_string())
        }
    }
}

#[tauri::command]
pub async fn read_coils(state: State<'_, Mutex<AppState>>, address: u16, count: u16) -> Result<Vec<bool>, String> {
    match tokio::time::timeout(STATE_MUTEX_TIMOUT, state.lock()).await {
        Ok(mut state_guard) => {
            state_guard.connection_state.read_coils(address, count).await.map_err(|e| {
                warn!("Error while reading coils from address {address} with count {count}: {}", e);
                if e.requires_reconnect() {
                    warn!("Error is not recoverable without reconnecting");
                }
                e.to_string()
            })
        },
        Err(_) => {
            warn!("Timeout while getting connection state");
            Err(HmPiError::ModbusLockTimeout.to_string())
        }
    }
}

#[tauri::command]
pub async fn write_coil(state: State<'_, Mutex<AppState>>, address: u16, value: bool) -> Result<(), String> {
    match tokio::time::timeout(STATE_MUTEX_TIMOUT, state.lock()).await {
        Ok(mut state_guard) => {
            state_guard.connection_state.write_coil(address, value).await.map_err(|e| {
                warn!("Error while writing coil at address {address} with value {value}: {}", e);
                if e.requires_reconnect() {
                    warn!("Error is not recoverable without reconnecting");
                }
                e.to_string()
            })
        },
        Err(_) => {
            warn!("Timeout while getting connection state");
            Err(HmPiError::ModbusLockTimeout.to_string())
        }
    }
}

#[tauri::command]
pub async fn write_coils(state: State<'_, Mutex<AppState>>, address: u16, values: Vec<bool>) -> Result<(), String> {
    match tokio::time::timeout(STATE_MUTEX_TIMOUT, state.lock()).await {
        Ok(mut state_guard) => {
            state_guard.connection_state.write_coils(address, &values).await.map_err(|e| {
                warn!("Error while writing coils at address {address} with values {:?}: {}", values, e);
                if e.requires_reconnect() {
                    warn!("Error is not recoverable without reconnecting");
                }
                e.to_string()
            })
        },
        Err(_) => {
            warn!("Timeout while getting connection state");
            Err(HmPiError::ModbusLockTimeout.to_string())
        }
    }
}
