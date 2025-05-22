import {JobStateLookup} from "@/types.ts";
import {error, info} from "@tauri-apps/plugin-log";


/**
 * Does this phase use the motor (does it have nice progress metrics)
 * @param state
 */
export function isJobStateMotor(state: JobStateLookup): boolean {
    switch(state) {
        case JobStateLookup.Prepare:
        case JobStateLookup.HeadUp:
        case JobStateLookup.HeadDown:
            return false;
        case JobStateLookup.PlanishToEnd:
        case JobStateLookup.PlanishToStart:
        case JobStateLookup.JogToStart:
        case JobStateLookup.JogToPark:
            return true
    }
}


export interface ActiveJob {
    pre_start_position: number;
    start_position: number;
    end_position: number;
    park_position: number;
    is_dual_pass: boolean;
    current_phase: JobStateLookup;
    current_position: number;
}

export function getPhaseStartingPos(job: ActiveJob, phase: JobStateLookup): number | null {
    switch(phase) {
        case JobStateLookup.Prepare:
            return null;
        case JobStateLookup.JogToStart:
            return job.pre_start_position;
        case JobStateLookup.HeadDown:
            return null;
        case JobStateLookup.PlanishToEnd:
            return job.start_position;
        case JobStateLookup.PlanishToStart:
            return job.end_position;
        case JobStateLookup.HeadUp:
            return null;
        case JobStateLookup.JogToPark:
            if(job.is_dual_pass) {
                return job.start_position;
            } else {
                return job.end_position;
            }
    }
}

export function getPhaseEndingPos(job: ActiveJob, phase: JobStateLookup): number | null {
    switch(phase) {
        case JobStateLookup.Prepare:
            return null;
        case JobStateLookup.JogToStart:
            return job.start_position;
        case JobStateLookup.HeadDown:
            return null;
        case JobStateLookup.PlanishToEnd:
            return job.end_position;
        case JobStateLookup.PlanishToStart:
            return job.start_position;
        case JobStateLookup.HeadUp:
            return null;
        case JobStateLookup.JogToPark:
            return job.park_position;
    }
}

export function getDistanceInPhase(job: ActiveJob, phase: JobStateLookup): number {
    const intraPhaseStartPos = getPhaseStartingPos(job, phase);
    const intraPhaseEndPos = getPhaseEndingPos(job, phase);

    if(intraPhaseStartPos === null || intraPhaseEndPos === null) {
        return 0;
    }

    return Math.abs(intraPhaseStartPos - intraPhaseEndPos);
}

export function getUsedPhaseList(is_dual_pass: boolean): JobStateLookup[] {
    const usedPhaseList: JobStateLookup[] = [];
    for(let phase: JobStateLookup = JobStateLookup.Prepare; phase <= JobStateLookup.JogToPark; phase++) {
        if(phase === JobStateLookup.PlanishToStart) {
            if(is_dual_pass) {
                usedPhaseList.push(phase);
            }
        } else {
            usedPhaseList.push(phase);
        }
    }
    return usedPhaseList;
}

export function getTotalDistance(job: ActiveJob): number {
    let distance = 0;
    const phases: JobStateLookup[] = getUsedPhaseList(job.is_dual_pass);
    for(let phase of phases) {
        distance += getDistanceInPhase(job, phase);
    }
    return distance;
}

export function getDistanceTravelled(job: ActiveJob): number {
    let distance = 0;
    const phases = getUsedPhaseList(job.is_dual_pass);

    for(let phase of phases) {
        if(phase >= job.current_phase) {
            break;
        }
        distance += getDistanceInPhase(job, phase);
    }

    const currentPhaseStartingPos = getPhaseStartingPos(job, job.current_phase);
    if(currentPhaseStartingPos !== null) {
        distance += Math.abs(currentPhaseStartingPos - job.current_position);
    }

    return distance;
}

/**
 * Get the progress on the current phase. Not the progress of the job! For example, for the 'jog to start' phase,
 * how close it is to reaching start.
 * @param job the job that this applies to.
 * @param phase the phase
 * @return the percent done with the phase or a bool if this
 *      information can't be known (waiting for pneumatics)
 */
export function getIntraPhaseProgress(job: ActiveJob, phase: JobStateLookup): number|boolean {
    if(isJobStateMotor(phase)){
        if(job.current_phase === phase) {
            const phaseStartPos = getPhaseStartingPos(job, job.current_phase);
            const phaseEndPos = getPhaseEndingPos(job, job.current_phase);

            if(phaseStartPos === null || phaseEndPos === null) {
                error("allegedly unreachable code");
                return 0;
            }

            const alreadyTravelled: number = Math.abs(phaseStartPos - job.current_position);
            const totalDistance: number = Math.abs(phaseStartPos - phaseEndPos);

            return alreadyTravelled / totalDistance;
        } else {
            // this triggers for states that are not current (already happened or haven't started)
            return (job.current_phase > phase) ? 1 : 0;
        }
    } else {
        return job.current_phase > phase;
    }


}

export function getTotalProgress(job: ActiveJob): number {
    return getDistanceTravelled(job) / getTotalDistance(job);
}

export interface JobPhaseInfo {
    phase: JobStateLookup,
    title: string,
    progress: number|boolean,
    isActive: boolean,
}

export function getPhaseInfo(job: ActiveJob, phase: JobStateLookup): JobPhaseInfo {
    let phaseTitle = "";

    switch(phase) {
        case JobStateLookup.Prepare:
            phaseTitle = "Prepare for cycle";
            break
        case JobStateLookup.JogToStart:
            phaseTitle = "Jog to start (" + job.start_position.toFixed(2) + " in)";
            break
        case JobStateLookup.HeadDown:
            phaseTitle = "Engage roller";
            break
        case JobStateLookup.PlanishToEnd:
            phaseTitle = "Planish to end (" + job.end_position.toFixed(2) + " in)";
            break
        case JobStateLookup.PlanishToStart:
            phaseTitle = "Re-planish to start (" + job.start_position.toFixed(2) + " in)";
            break
        case JobStateLookup.HeadUp:
            phaseTitle = "Raise head";
            break
        case JobStateLookup.JogToPark:
            phaseTitle = "Jog to park (" + job.park_position.toFixed(2) + " in)";
            break
    }
    const prog = getIntraPhaseProgress(job, phase);

    return {
        phase: phase,
        title: phaseTitle,
        progress: prog,
        isActive: job.current_phase === phase,
    }
}


export function getPhaseInfos(job: ActiveJob): JobPhaseInfo[] {
    const phaseInfos: JobPhaseInfo[] = [];
    const phases = getUsedPhaseList(job.is_dual_pass);
    for(let phase of phases) {
        phaseInfos.push(getPhaseInfo(job, phase));
    }
    return phaseInfos;
}