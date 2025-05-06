

export enum Mode {
    Execute,
    Manual,
    Home,
    CameraPreview,
    Terminal,
}


export enum ActuatorState {
    CommandedOffSensedOff= 0b00,
    CommandedOffSensedOn=0b01,
    CommandedOnSensedOff=0b10,
    CommandedOnSensedOn=0b11,
}

export function toggleActuator(state: ActuatorState): ActuatorState {
    if (state === ActuatorState.CommandedOnSensedOff ||
        state === ActuatorState.CommandedOnSensedOn){

    }
}
