export enum MessageHeader {
    ReadRequest = "Rr",
    WriteRequest = "Wr",
    ReadSuccess = "Rs",
    WriteSuccess = "Ws",
    ReadFail = "Rf",
    WriteFail = "Wf",
    ExecuteRequest = "Xr",
    ExecuteSuccess = "Xs",
    ExecuteFail = "Xf",
    Broadcast = "Bc",
}

export interface MiTcpMessage {
    header: MessageHeader,
    target: string,
    data?: number[]
}

export function toString(message: MiTcpMessage): string {
    const { header, target, data } = message;
    const dataStr = data ? data.join(", ") : "None";
    return `MiTcpMessage { header: ${header}, target: ${target}, data: [${dataStr}] }`;
}


function isMessageHeader(value: string): value is MessageHeader {
    return Object.values(MessageHeader).includes(value as MessageHeader);
}


export function decodeMessage(bytes: number[]): MiTcpMessage {
    if (bytes.length < 5) { // Minimum length is now 5 bytes: 2 (header) + 1 (length) + 1 (target at least) + 1 (null terminator)
        throw new Error("Message too short");
    }

    const header_text = String.fromCharCode(bytes[0], bytes[1]);

    if (!isMessageHeader(header_text)) {
        throw new Error("Invalid header_text: " + header_text);
    }

    const header: MessageHeader = header_text as MessageHeader;

    // Updated: Message length is now 1 byte
    const length = bytes[2];

    if (bytes.length !== length || bytes[length - 1] !== 0) {
        throw new Error("Incoming message length does not match expected length or does not end with null");
    }

    let payload_start_index: number = 0;
    let contains_payload: boolean = false;

    for (let i = 3; i < length; i++) {
        if (bytes[i] === '\n'.charCodeAt(0)) {
            payload_start_index = i;
            contains_payload = true;
            break;
        }
    }
    const target_end_index = contains_payload ? payload_start_index : length - 1;

    const target = String.fromCharCode(...bytes.slice(3, target_end_index));

    // If only the header and target exist (no payload)
    if (!contains_payload) {
        return {
            header: header,
            target: target,
        };
    } else {
        const payload: number[] = bytes.slice(payload_start_index + 1, length - 1);
        return {
            header: header,
            target: target,
            data: payload,
        };
    }
}

export function encodeMessage(message: MiTcpMessage): number[] {
    const bytes: number[] = [];

    // Step 1: Add the header (2 bytes)
    bytes.push(...message.header.split('').map((char) => char.charCodeAt(0)));

    // Step 2: Variable/Function Name
    const targetBytes = [...message.target].map((char) => char.charCodeAt(0));

    if (targetBytes.includes(0)) {
        throw new Error("Target string cannot contain null bytes (0x00)");
    }

    // Step 3: Calculate total message length
    // Base length: Header (2 bytes) + Length (1 byte) + Target (variable part) + Null (1 byte)
    let totalLength = 3 + targetBytes.length + 1;

    const has_payload: boolean = message.data !== undefined;
    if (has_payload) {
        // see above for undefined check
        totalLength += (message.data.length + 1);
    }

    if (totalLength > 255) {
        throw new Error("Message too long for 1-byte length field");
    }

    // Updated: Add the total length as 1 byte
    bytes.push(totalLength & 0xff);

    // Step 4: Add the target name
    bytes.push(...targetBytes);

    // Step 5: Add the data (payload) if it exists
    if (has_payload) {
        bytes.push('\n'.charCodeAt(0));
        bytes.push(...message.data);
    }

    // Add null terminator
    bytes.push(0);

    if (bytes.length !== totalLength) {
        throw new Error("Calculated length does not match actual length");
    }

    return bytes;
}