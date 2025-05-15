
export enum Mode {
    Execute,
    Manual,
    Home,
    CameraPreview,
}


export interface Actuator {
    commanded: boolean | undefined;
    sensed: boolean | undefined;
}