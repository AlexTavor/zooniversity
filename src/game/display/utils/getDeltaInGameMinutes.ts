import { ECS } from "../../ECS";
import { TimeConfig } from "../../config/TimeConfig";
import { getTime } from "../../logic/time/TimeComponent";

export function getDeltaInGameMinutes(ecs: ECS, deltaMs: number): number {
    const time = getTime(ecs);
    if (!time || time.speedFactor === 0) return 0;

    const realSecondsPassed = deltaMs / 1000;
    const gameMinutesPassed =
        (realSecondsPassed / TimeConfig.RealSecondsPerHour) *
        TimeConfig.MinutesPerHour *
        time.speedFactor;
    return gameMinutesPassed;
}
