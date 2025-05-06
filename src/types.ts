import {MessageHeader, MiTcpMessage} from "./MiTcp.ts";


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
