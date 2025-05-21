
export enum Mode {
    Execute,
    Manual,
    Home,
    CameraPreview,
    Learn,
}

export enum PositionType {
    Start = "start",
    End = "end",
    Park = "park"
}

export enum JogDirection {
    POSITIVE = "pos",
    NEGATIVE = "neg",
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