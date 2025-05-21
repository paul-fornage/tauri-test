use crate::error::HmPiError;
use crate::DEFAULT_SOCKET_ADDR;
use log::{debug, info, warn};
use std::net::SocketAddr;
use tokio_modbus::client::{self, tcp, Client, Context, Reader};

pub mod commands;
mod register;

pub enum ConnectionState {
    Connected(Context, SocketAddr),
    Disconnected,
    Error,
}

impl ConnectionState {
    pub fn is_connected(&self) -> bool {
        match self {
            ConnectionState::Connected(_, _) => true,
            _ => false,
        }
    }

    pub fn state_name(&self) -> &'static str {
        match self {
            ConnectionState::Connected(_, _) => "Connected",
            ConnectionState::Disconnected => "Disconnected",
            ConnectionState::Error => "Error",
        }
    }

    pub async fn try_connect(&mut self, socket_addr: SocketAddr) -> Result<(), HmPiError> {
        match tcp::connect(socket_addr).await {
            Ok(ctx) => {
                *self = ConnectionState::Connected(ctx, socket_addr);
                Ok(())
            }
            Err(e) => {
                *self = ConnectionState::Error;
                Err(HmPiError::from(e))
            }
        }
    }

    pub async fn try_disconnect(&mut self) -> Result<(), HmPiError> {
        match self {
            ConnectionState::Connected(ctx, _) => {
                ctx.disconnect().await?;
                *self = ConnectionState::Disconnected;
                Ok(())
            }
            ConnectionState::Disconnected => Err(HmPiError::ModbusDisconnectedState),
            ConnectionState::Error => Err(HmPiError::ModbusErrorState),
        }
    }

    pub async fn reset(&mut self, socket_addr: SocketAddr) -> Result<(), HmPiError> {
        match self {
            ConnectionState::Connected(ctx, _) => match ctx.disconnect().await {
                Ok(_) => {}
                Err(e) => {
                    warn!(
                        "Error disconnecting: {}\nIgnoring error and attempting to reconnect",
                        e
                    );
                }
            },
            _ => {}
        }
        self.try_connect(socket_addr).await
    }
}
