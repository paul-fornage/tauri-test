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
        if (this.value === undefined) {
            throw new Error("Value is undefined");
        }

        // Create a buffer to hold 8 bytes (64 bits)
        const buffer = new ArrayBuffer(8);
        const view = new DataView(buffer);

        // Set the value as a 64-bit float (big-endian encoding)
        view.setFloat64(0, this.value, false); // false for big-endian

        return new Uint8Array(buffer);
    }


    fromBytes(bytes: Uint8Array): void {
        if (bytes.length !== 8) {
            throw new Error("Invalid byte array length for a 64-bit float");
        }

        // Create a DataView from the bytes
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

        // Get the value as a 64-bit float (big-endian decoding)
        this.value = view.getFloat64(0, false); // false for big-endian
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