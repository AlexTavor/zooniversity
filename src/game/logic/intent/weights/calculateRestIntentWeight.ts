import { ECS, Entity } from "../../../ECS";
import { CharacterIntent } from "../intent-to-action/actionIntentData";
import { ScheduleComponent } from "../../characters/ScheduleComponent";
import { NeedsComponent } from "../../needs/NeedsComponent";

export function calculateRestIntentWeight(
    _ecs: ECS,
    _entity: Entity,
    schedule: ScheduleComponent,
    _needs: NeedsComponent,
    currentHour: number,
): number {
    if (schedule.entries[currentHour] === CharacterIntent.REST) return 10;
    return 10;
}
