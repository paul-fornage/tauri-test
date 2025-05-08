import {MessageHeader, MiTcpMessage} from "./MiTcp.ts";



interface RemoteVariable<T> {
    name: string;
    value?: T;
    toBytes(): Uint8Array;
    readBytes(bytes: Uint8Array): void;
}

class RemoteVariableF64 implements RemoteVariable<number> {
    name: string;
    value?: number;

    constructor(name: string, value?: number) {
        this.name = name;
        this.value = value;
    }

    toBytes(): Uint8Array {
        return new Uint8Array([this.value]);
    }
}

export enum Mode {
    Execute,
    Manual,
    Home,
    CameraPreview,
    Terminal,
}


export class Actuator {
    commanded: boolean | undefined;
    sensed: boolean | undefined;

    constructor(commanded?: boolean, sensed?: boolean) {
        this.commanded = commanded;
        this.sensed = sensed;
    }

    is_fully_engaged(): boolean {
        return this.commanded === true && this.sensed === true;
    }

    is_fully_disengaged(): boolean {
        return this.commanded === false && this.sensed === false;
    }

    has_unknown_state(): boolean {
        return this.commanded == undefined || this.sensed == undefined;
    }

    toggleCommanded(): MiTcpMessage|null {
        if (this.commanded != undefined) {
            return {
                header: MessageHeader.WriteRequest,
                target: "fingers_commanded",
                data: [this.commanded ? 1 : 0],
            };
        }
        return null;
    }
}