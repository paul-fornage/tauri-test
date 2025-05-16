import { ref } from "vue";
import { invoke } from '@tauri-apps/api/core';
import {debug} from '@tauri-apps/plugin-log';

export class CoilRegister {
    addr: number;
    value: boolean;

    constructor(addr: number, value: boolean) {
        this.addr = addr;
        this.value = value;
    }

    async write_value(value: boolean) {
        await invoke('write_coil', {address: this.addr, value: value})
    }

    read_value(list: [boolean]) {
        if(list[this.addr] != undefined) {
            this.value = list[this.addr];
        }
    }
}

export const is_mandrel_latch_closed            = ref(new CoilRegister(0 , false)); // R    mandrel latch sensor reading. True for closed and safe
export const is_fingers_down                    = ref(new CoilRegister(1 , false)); // R    Are the workpiece holding fingers commanded down
export const is_homed                           = ref(new CoilRegister(2 , false)); // R    Has the axis been homed
export const is_fault                           = ref(new CoilRegister(3 , false)); // R    A fault state indicating a software issue; HMI shows a problem with the CC
export const is_ready_for_cycle                 = ref(new CoilRegister(4 , false)); // R    Is the clearcore ready to execute its program
export const is_e_stop                          = ref(new CoilRegister(5 , false)); // R    Is the E-stop currently active
export const is_job_active                      = ref(new CoilRegister(6 , false)); // R    Is the clearcore executing its program? Remains true while paused
export const is_ready_for_manual_control        = ref(new CoilRegister(7 , false)); // R    Is the clearcore ready for manual control, ensuring safety checks and no cycle in progress
export const is_roller_down                     = ref(new CoilRegister(8 , false)); // R    Is the roller down/engaged
export const cc_commanded_roller                = ref(new CoilRegister(9 , false)); // R    Roller state commanded by the CC, true means engaged, false means disengaged
export const cc_commanded_fingers               = ref(new CoilRegister(10, false)); // R    Finger state commanded by the CC, true means engaged, false means disengaged
export const is_commanded_pos_latched           = ref(new CoilRegister(21, false)); // R/W  Has the HMI requested a new commanded position. If true, reads the commanded position
export const is_rth_button_latched              = ref(new CoilRegister(30, false)); // R/W  Is the "Return to Home" button latched
export const is_axis_homing_button_latched      = ref(new CoilRegister(31, false)); // R/W  Has the 'run axis homing sequence' button been pressed. Resets to 0 on completion
export const is_set_job_start_button_latched    = ref(new CoilRegister(32, false)); // R/W  Has the 'Set start to current position' button been pressed. Resets to 0 on completion
export const is_set_job_end_button_latched      = ref(new CoilRegister(33, false)); // R/W  Has the 'Set end to current position' button been pressed. Resets to 0 on completion
export const is_set_job_park_button_latched     = ref(new CoilRegister(34, false)); // R/W  Has the 'Set park to current position' button been pressed. Resets to 0 on completion
export const is_commit_job_button_latched       = ref(new CoilRegister(35, false)); // R/W  Has the 'Commit job' button been pressed. Resets to 0 on completion
export const is_finger_up_latched               = ref(new CoilRegister(40, false)); // R/W  Has the 'Finger up' button been pressed. Resets to 0 on completion
export const is_finger_down_latched             = ref(new CoilRegister(41, false)); // R/W  Has the 'Finger down' button been pressed. Resets to 0 on completion
export const is_roller_up_latched               = ref(new CoilRegister(42, false)); // R/W  Has the 'Roller up' button been pressed. Resets to 0 on completion
export const is_roller_down_latched             = ref(new CoilRegister(43, false)); // R/W  Has the 'Roller down' button been pressed. Resets to 0 on completion
export const is_jog_pos_pressed                 = ref(new CoilRegister(44, false)); // R    Jogging in positive direction button pressed
export const is_jog_neg_pressed                 = ref(new CoilRegister(45, false)); // R    Jogging in negative direction button pressed
export const is_start_cycle_button_latched      = ref(new CoilRegister(46, false)); // R/W  Start cycle button pressed
export const is_cancel_cycle_button_latched     = ref(new CoilRegister(47, false)); // R/W  Cancel cycle button pressed
export const is_pause_cycle_button_latched      = ref(new CoilRegister(48, false)); // R/W  Pause cycle button pressed
export const can_fingers_raise                  = ref(new CoilRegister(49, false)); // R    Are fingers allowed to raise
export const can_fingers_lower                  = ref(new CoilRegister(50, false)); // R    Are fingers allowed to lower
export const can_roller_raise                   = ref(new CoilRegister(51, false)); // R    Is the roller allowed to raise
export const can_roller_lower                   = ref(new CoilRegister(52, false)); // R    Is the roller allowed to lower
export const show_message                       = ref(new CoilRegister(53, false)); // R    Display a message on the HMI
export const is_ready_to_home                   = ref(new CoilRegister(54, false)); // R    Is the system ready to home
export const is_dual_pass_mode                  = ref(new CoilRegister(55, false)); // W    Is the operation in dual pass mode
export const is_job_paused                      = ref(new CoilRegister(56, false)); // R    Is the job paused
export const is_temp_job_unsaved                = ref(new CoilRegister(57, false)); // R    Does the temp job have unsaved changes? (is temp job != saved job)
export const is_reset_temp_job_latched          = ref(new CoilRegister(58, false)); // R    Latch for button that resets the temp job back to saved job values
export const is_idle_state                      = ref(new CoilRegister(59, false)); // R    Is the machine in the idle state? Used for enabling certain button that only have an effect in idle
export const is_homing                           = ref(new CoilRegister(60, false)); // R    Is the machine homing the carriage right now?

export class HregRegister {
    addr: number;
    value: number;

    constructor(addr: number, value: number) {
        this.addr = addr;
        this.value = value;
    }

    async write_value(value: number) {
        await invoke('write_hreg', {address: this.addr, value: value})
    }

    read_value(list: [number]) {
        if(list[this.addr] != undefined) {
            this.value = list[this.addr];
        }
    }
}

export const actual_position         = ref(new HregRegister(1 , 0));
export const cc_commanded_position   = ref(new HregRegister(2 , 0));
export const hmi_commanded_position  = ref(new HregRegister(3 , 0));
export const job_progress            = ref(new HregRegister(5 , 0));
export const job_start_pos           = ref(new HregRegister(6 , 0));
export const job_end_pos             = ref(new HregRegister(7 , 0));
export const job_park_pos            = ref(new HregRegister(8 , 0));
export const min_pos                 = ref(new HregRegister(9 , 0));
export const max_pos                 = ref(new HregRegister(10, 0));
export const jog_speed               = ref(new HregRegister(11, 0));
export const planish_speed           = ref(new HregRegister(12, 0));
export const fault_code              = ref(new HregRegister(13, 0));
export const heartbeat_in            = ref(new HregRegister(14, 0));
export const heartbeat_out           = ref(new HregRegister(15, 0));
export const current_state           = ref(new HregRegister(16, 0));
export const hmi_job_start_pos       = ref(new HregRegister(17, 0));
export const hmi_job_end_pos         = ref(new HregRegister(18, 0));
export const hmi_job_park_pos        = ref(new HregRegister(19, 0));
export const cc_iteration_time       = ref(new HregRegister(20, 0));

export class HregRegisterRange {
    addr_start: number;
    length: number;
    values: [number]; // 16 bit unsigned integers

    constructor(addr_start: number, length: number, values: [number]) {
        this.addr_start = addr_start;
        this.length = length;
        this.values = values;
    }

    /**
     * Returns the utf-8 encoded representation of the register range.
     * will stop at the first null byte or the end of the array.
     * Each value makes up 2 characters.
     */
    as_text(): string {
        const result: string[] = [];
        for (const value of this.values) {
            // Stop if a null byte (0) is encountered


            // Get high and low bytes of the 16-bit value
            const highByte = (value >> 8) & 0xFF;
            const lowByte = value & 0xFF;

            // Convert each byte to a character and append to the result
            if (lowByte !== 0) {
                result.push(String.fromCharCode(lowByte));
            } else {
                break;
            }
            if (highByte !== 0) {
                result.push(String.fromCharCode(highByte));
            } else {
                break;
            }

        }

        // Join characters and return as string
        return result.join('');
    }
}

export const message_register_range = ref(new HregRegisterRange(32, 32, [0]));



export async function read_coils(): Promise<void> {
    try {
        const res = await invoke('read_coils', { address: 0, count: 64 });
        const coilArray = res as [boolean];
        is_mandrel_latch_closed.value.read_value(coilArray);
        is_fingers_down.value.read_value(coilArray);
        is_homed.value.read_value(coilArray);
        is_fault.value.read_value(coilArray);
        is_ready_for_cycle.value.read_value(coilArray);
        is_e_stop.value.read_value(coilArray);
        is_job_active.value.read_value(coilArray);
        is_ready_for_manual_control.value.read_value(coilArray);
        is_roller_down.value.read_value(coilArray);
        cc_commanded_roller.value.read_value(coilArray);
        cc_commanded_fingers.value.read_value(coilArray);
        is_commanded_pos_latched.value.read_value(coilArray);
        is_rth_button_latched.value.read_value(coilArray);
        is_axis_homing_button_latched.value.read_value(coilArray);
        is_set_job_start_button_latched.value.read_value(coilArray);
        is_set_job_end_button_latched.value.read_value(coilArray);
        is_set_job_park_button_latched.value.read_value(coilArray);
        is_commit_job_button_latched.value.read_value(coilArray);
        is_finger_up_latched.value.read_value(coilArray);
        is_finger_down_latched.value.read_value(coilArray);
        is_roller_up_latched.value.read_value(coilArray);
        is_roller_down_latched.value.read_value(coilArray);
        is_jog_pos_pressed.value.read_value(coilArray);
        is_jog_neg_pressed.value.read_value(coilArray);
        is_start_cycle_button_latched.value.read_value(coilArray);
        is_cancel_cycle_button_latched.value.read_value(coilArray);
        is_pause_cycle_button_latched.value.read_value(coilArray);
        can_fingers_raise.value.read_value(coilArray);
        can_fingers_lower.value.read_value(coilArray);
        can_roller_raise.value.read_value(coilArray);
        can_roller_lower.value.read_value(coilArray);
        show_message.value.read_value(coilArray);
        is_ready_to_home.value.read_value(coilArray);
        is_dual_pass_mode.value.read_value(coilArray);
        is_job_paused.value.read_value(coilArray);
        is_temp_job_unsaved.value.read_value(coilArray);
        is_reset_temp_job_latched.value.read_value(coilArray);
        is_idle_state.value.read_value(coilArray);
        is_homing.value.read_value(coilArray);
    } catch (error) {
        throw error; // Propagate the error up the chain
    }
}


export async function read_hregs(): Promise<void> {
    try {
        const res = await invoke('read_hregs', { address: 0, count: 64 });
        const hregArray = res as [number];
        actual_position.value.read_value(hregArray);
        cc_commanded_position.value.read_value(hregArray);
        hmi_commanded_position.value.read_value(hregArray);
        job_progress.value.read_value(hregArray);
        job_start_pos.value.read_value(hregArray);
        job_end_pos.value.read_value(hregArray);
        job_park_pos.value.read_value(hregArray);
        min_pos.value.read_value(hregArray);
        max_pos.value.read_value(hregArray);
        jog_speed.value.read_value(hregArray);
        planish_speed.value.read_value(hregArray);
        fault_code.value.read_value(hregArray);
        heartbeat_in.value.read_value(hregArray);
        heartbeat_out.value.read_value(hregArray);
        current_state.value.read_value(hregArray);
        hmi_job_start_pos.value.read_value(hregArray);
        hmi_job_end_pos.value.read_value(hregArray);
        hmi_job_park_pos.value.read_value(hregArray);
        cc_iteration_time.value.read_value(hregArray);


        for (let i = 0; i < message_register_range.value.length; i++) {
            message_register_range.value.values[i] = hregArray[message_register_range.value.addr_start + i] || 0;
        }
    } catch(error){
        throw error;
    }
}


export function debug_print_coils(){
    debug("is_mandrel_latch_closed: " + (is_mandrel_latch_closed.value.value ? "true" : "false"));
    debug("is_fingers_down: " + (is_fingers_down.value.value ? "true" : "false"));
    debug("is_homed: " + (is_homed.value.value ? "true" : "false"));
    debug("is_fault: " + (is_fault.value.value ? "true" : "false"));
    debug("is_ready_for_cycle: " + (is_ready_for_cycle.value.value ? "true" : "false"));
    debug("is_e_stop: " + (is_e_stop.value.value ? "true" : "false"));
    debug("is_job_active: " + (is_job_active.value.value ? "true" : "false"));
    debug("is_ready_for_manual_control: " + (is_ready_for_manual_control.value.value ? "true" : "false"));
    debug("is_roller_down: " + (is_roller_down.value.value ? "true" : "false"));
    debug("cc_commanded_roller: " + (cc_commanded_roller.value.value ? "true" : "false"));
    debug("cc_commanded_fingers: " + (cc_commanded_fingers.value.value ? "true" : "false"));
    debug("is_commanded_pos_latched: " + (is_commanded_pos_latched.value.value ? "true" : "false"));
    debug("is_rth_button_latched: " + (is_rth_button_latched.value.value ? "true" : "false"));
    debug("is_axis_homing_button_latched: " + (is_axis_homing_button_latched.value.value ? "true" : "false"));
    debug("is_set_job_start_button_latched: " + (is_set_job_start_button_latched.value.value ? "true" : "false"));
    debug("is_set_job_end_button_latched: " + (is_set_job_end_button_latched.value.value ? "true" : "false"));
    debug("is_set_job_park_button_latched: " + (is_set_job_park_button_latched.value.value ? "true" : "false"));
    debug("is_commit_job_button_latched: " + (is_commit_job_button_latched.value.value ? "true" : "false"));
    debug("is_finger_up_latched: " + (is_finger_up_latched.value.value ? "true" : "false"));
    debug("is_finger_down_latched: " + (is_finger_down_latched.value.value ? "true" : "false"));
    debug("is_roller_up_latched: " + (is_roller_up_latched.value.value ? "true" : "false"));
    debug("is_roller_down_latched: " + (is_roller_down_latched.value.value ? "true" : "false"));
    debug("is_jog_pos_pressed: " + (is_jog_pos_pressed.value.value ? "true" : "false"));
    debug("is_jog_neg_pressed: " + (is_jog_neg_pressed.value.value ? "true" : "false"));
    debug("is_start_cycle_button_latched: " + (is_start_cycle_button_latched.value.value ? "true" : "false"));
    debug("is_cancel_cycle_button_latched: " + (is_cancel_cycle_button_latched.value.value ? "true" : "false"));
    debug("is_pause_cycle_button_latched: " + (is_pause_cycle_button_latched.value.value ? "true" : "false"));
    debug("can_fingers_raise: " + (can_fingers_raise.value.value ? "true" : "false"));
    debug("can_fingers_lower: " + (can_fingers_lower.value.value ? "true" : "false"));
    debug("can_roller_raise: " + (can_roller_raise.value.value ? "true" : "false"));
    debug("can_roller_lower: " + (can_roller_lower.value.value ? "true" : "false"));
    debug("show_message: " + (show_message.value.value ? "true" : "false"));
    debug("is_ready_to_home: " + (is_ready_to_home.value.value ? "true" : "false"));
    debug("is_dual_pass_mode: " + (is_dual_pass_mode.value.value ? "true" : "false"));
    debug("is_job_paused: " + (is_job_paused.value.value ? "true" : "false"));
    debug("is_temp_job_unsaved: " + (is_temp_job_unsaved.value.value ? "true" : "false"));
    debug("is_reset_temp_job_latched: " + (is_reset_temp_job_latched.value.value ? "true" : "false"));
    debug("is_idle_state: " + (is_idle_state.value.value ? "true" : "false"));
    debug("is_homing: " + (is_homing.value.value ? "true" : "false"));
}