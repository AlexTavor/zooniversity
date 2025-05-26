import { ECS, Entity } from "../../ECS";
import { CharacterIntent } from "../action-intent/actionIntentData";
import { canHarvest as canHarvest } from "../action-intent/intent-handlers/handleHarvestIntentLogic";
import { ScheduleComponent } from "../characters/ScheduleComponent";
import { NeedsComponent } from "../needs/NeedsComponent";

export function calculateHarvestIntentWeight(ecs: ECS, entity: Entity, schedule: ScheduleComponent, needs: NeedsComponent, currentHour: number): number {
    if (schedule.entries[currentHour] !== CharacterIntent.HARVEST) return 0;
    return canHarvest(ecs, entity) ? 100 : 0;
}
