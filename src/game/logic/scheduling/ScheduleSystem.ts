import { ECS, Entity, System } from "../../ECS";
import { ActionIntentComponent } from "../action-intent/ActionIntentComponent";
import { BlockedIntentComponent } from "../action-intent/BlockedIntentComponent";
import { CharacterAction, CharacterIntent } from "../action-intent/actionIntentData";
import { TimeComponent } from "../time/TimeComponent";
import { ScheduleComponent } from "./ScheduleComponent";

export class ScheduleSystem extends System {
    public componentsRequired = new Set<Function>([ScheduleComponent, ActionIntentComponent]);
    private worldTimeEntity: Entity | null = null;

    private getCurrentHour(ecs: ECS): number | null {
        if (this.worldTimeEntity === null || !ecs.hasEntity(this.worldTimeEntity)) {
            const timeEntities = ecs.getEntitiesWithComponent(TimeComponent);
            if (timeEntities.length > 0) {
                this.worldTimeEntity = timeEntities[0];
            } else {
                return null; 
            }
        }
        return ecs.getComponent(this.worldTimeEntity, TimeComponent).hour;
    }

    public update(entities: Set<Entity>, delta: number): void {
        const currentHour = this.getCurrentHour(this.ecs);
        if (currentHour === null) return;

        for (const entity of entities) {
            const schedule = this.ecs.getComponent(entity, ScheduleComponent);

            if (schedule.lastScheduleStartHour == currentHour) {
                // No need to update if the schedule hasn't changed since the last hour
                continue;
            }

            const actionIntent = this.ecs.getComponent(entity, ActionIntentComponent);

            const newScheduledIntent: CharacterIntent = schedule.entries[currentHour] as CharacterIntent;

            if (actionIntent.intentType !== newScheduledIntent) {
                actionIntent.intentType = newScheduledIntent;
                actionIntent.currentPerformedAction = CharacterAction.IDLE;
                actionIntent.actionData = undefined;
                
                schedule.lastScheduleStartHour = currentHour;

                // If schedule dictates a new intent, any previous "blocked" state is now void.
                if (this.ecs.hasComponent(entity, BlockedIntentComponent)) {
                    this.ecs.removeComponent(entity, BlockedIntentComponent);
                }
            }
        }
    }
}