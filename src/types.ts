
export enum Mode {
    Execute,
    Manual,
    Home,
    CameraPreview,
    Learn,
}

export enum JobStatus {
    NotReady,
    Ready,
    Paused,
    Running,
}

export interface JobStatusMessage {
    text: string,
    job_status: JobStatus,
}


export enum PositionType {
    Start = "start",
    End = "end",
    Park = "park"
}

export enum PhaseWorkingStatus {
    NotStarted = 'NotStarted',
    Working = 'Working',
    Done = 'Done',
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



export enum JobStateLookup {
    Prepare,
    JogToStart,
    HeadDown,
    PlanishToEnd,
    PlanishToStart,
    HeadUp,
    JogToPark,
}