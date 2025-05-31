import { ECS, Entity } from "../../ECS";
import { ActionIntentComponent } from "./intent-to-action/ActionIntentComponent";
import { canSleep as canSleep } from "./intent-to-action/intent-handlers/handleSleepIntentLogic";
import { ScheduleComponent } from "../characters/ScheduleComponent";
import { NeedType, NeedsComponent } from "../needs/NeedsComponent";
import { CharacterAction } from "./intent-to-action/actionIntentData";

export function calculateEatIntentWeight(ecs: ECS, entity: Entity, intent: ActionIntentComponent, schedule: ScheduleComponent, needs: NeedsComponent, currentHour: number): number {
    let weight = 0;
    const eat = needs.need(NeedType.FOOD);

    if (!eat){
        return 0;
    }

    const eatNeed = eat.current / eat.max; // Normalized 1.0 (full) to 0.0 (empty)

    if (eatNeed < 0.3) weight += 200 * (1 - eatNeed);   // Starving!
    else if (eatNeed < 0.85) weight += 50 * (1 - eatNeed); // Hungry

    if (eatNeed >= 1){
        return 0;
    }

    if (intent.currentPerformedAction == CharacterAction.EATING){
        weight += 100;
    }

    return canSleep(ecs, entity) ? weight : 0;
}
