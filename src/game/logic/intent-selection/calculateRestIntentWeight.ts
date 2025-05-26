import { ECS, Entity } from "../../ECS";
import { CharacterIntent } from "../action-intent/actionIntentData";
import { ScheduleComponent } from "../characters/ScheduleComponent";
import { NeedsComponent } from "../needs/NeedsComponent";

export function calculateRestIntentWeight(ecs: ECS, entity: Entity, schedule: ScheduleComponent, needs: NeedsComponent, currentHour: number): number {
    if (schedule.entries[currentHour] === CharacterIntent.REST) return 60;
    return 10;
}
