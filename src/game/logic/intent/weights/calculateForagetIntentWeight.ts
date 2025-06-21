import { ECS, Entity } from "../../../ECS";
import { CharacterIntent } from "../intent-to-action/actionIntentData";
import { ScheduleComponent } from "../../characters/ScheduleComponent";
import { NeedsComponent } from "../../needs/NeedsComponent";
import { canForage } from "../intent-to-action/intent-handlers/handleForageIntentLogic";

export function calculateForagetIntentWeight(
    ecs: ECS,
    entity: Entity,
    schedule: ScheduleComponent,
    _: NeedsComponent,
    currentHour: number,
): number {
    if (schedule.entries[currentHour] !== CharacterIntent.FORAGE) return 0;
    return canForage(ecs, entity) ? 100 : 0;
}
