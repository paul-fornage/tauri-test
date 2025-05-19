
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

export enum KeypadFunctionButton{
    zero = 0,
    one,
    two,
    three,
    four,
    five,
    six,
    seven,
    eight,
    nine = 9,
    clear = 10,
    delete,
    dot,
    enter,
    blank,
}