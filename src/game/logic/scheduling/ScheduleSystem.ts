import { System, Entity } from "../../ECS";
import { ActionIntentComponent } from "../action-intent/ActionIntentComponent"; 
import { CharacterIntent } from "../action-intent/actionIntentData"; 
import { TimeComponent } from "../time/TimeComponent"; 
import { ScheduleComponent } from "./ScheduleComponent"; 

export class ScheduleSystem extends System {
    public componentsRequired = new Set<Function>([ScheduleComponent, ActionIntentComponent]);

    public update(entities: Set<Entity>, delta: number): void {
        const timeEntity = this.ecs.getEntitiesWithComponent(TimeComponent)[0];
        if (!timeEntity) return; // No time, no schedule updates

        const time = this.ecs.getComponent(timeEntity, TimeComponent);
        const currentHour = time.hour;

        for (const entity of entities) {
            const schedule = this.ecs.getComponent(entity, ScheduleComponent);
            const actionIntent = this.ecs.getComponent(entity, ActionIntentComponent);

            if (actionIntent.schduleOverrideStartHour !== -1 && actionIntent.schduleOverrideStartHour == currentHour) {
              continue
            }
            
            actionIntent.schduleOverrideStartHour = -1; // Reset override hour if it has passed

            // ScheduleEntry is now CharacterIntent. Ensure ScheduleComponent.entries uses CharacterIntent.
            const newScheduledIntent: CharacterIntent = schedule.entries[currentHour] as CharacterIntent;

            if (actionIntent.intentType !== newScheduledIntent) {
                actionIntent.intentType = newScheduledIntent;
            }
        }
    }
}