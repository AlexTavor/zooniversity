import { ECS, Entity } from "../../ECS";
import { ActionIntentComponent } from "./intent-to-action/ActionIntentComponent";
import { CharacterIntent } from "./intent-to-action/actionIntentData";
import { canSleep as canSleep } from "./intent-to-action/intent-handlers/handleSleepIntentLogic";
import { ScheduleComponent } from "../characters/ScheduleComponent";
import { NeedType, NeedsComponent } from "../needs/NeedsComponent";

export function calculateSleepIntentWeight(ecs: ECS, entity: Entity, intent: ActionIntentComponent, schedule: ScheduleComponent, needs: NeedsComponent, currentHour: number): number {
    let weight = 0;
    const sleep = needs.need(NeedType.SLEEP);

    if (!sleep){
        return 0;
    }

    const sleepNeed = sleep.current / sleep.max; // Normalized 1.0 (full) to 0.0 (empty)

    if (sleepNeed < 0.3) weight += 200 * (1 - sleepNeed); // Very high weight if very tired
    else if (sleepNeed < 0.6) weight += 50 * (1 - sleepNeed);

    if (sleepNeed >= 1){
        return 0;
    }

    if (schedule.entries[currentHour] === CharacterIntent.SLEEP) {
        weight += 20;
    }

    if (intent.intentType == CharacterIntent.SLEEP){
        weight += 100;
    }

    return canSleep(ecs, entity) ? weight : 0;
}
