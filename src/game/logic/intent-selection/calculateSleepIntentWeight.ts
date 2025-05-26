import { ECS, Entity } from "../../ECS";
import { CharacterIntent } from "../action-intent/actionIntentData";
import { canSleep as canSleep } from "../action-intent/intent-handlers/handleSleepIntentLogic";
import { ScheduleComponent } from "../characters/ScheduleComponent";
import { NeedsComponent } from "../needs/NeedsComponent";

export function calculateSleepIntentWeight(ecs: ECS, entity: Entity, schedule: ScheduleComponent, needs: NeedsComponent, currentHour: number): number {
    let weight = 0;
    const sleepNeed = needs.sleep.current / needs.sleep.max; // Normalized 1.0 (full) to 0.0 (empty)

    if (sleepNeed < 0.3) weight += 200 * (1 - sleepNeed); // Very high weight if very tired
    else if (sleepNeed < 0.6) weight += 50 * (1 - sleepNeed);

    if (schedule.entries[currentHour] === CharacterIntent.SLEEP) {
        weight += 80; // Boost if scheduled
    }

    return canSleep(ecs, entity) ? weight : 0;
}
