import { System, Entity, ECS } from "../../ECS";
import { ActionIntentComponent } from "../action-intent/ActionIntentComponent";
import { CharacterAction } from "../action-intent/actionIntentData";
import { ActiveBuffsComponent } from "./ActiveBuffsComponent";
import { MIN_SLEEP_DURATION_FOR_RESTED_BUFF_MINUTES, BuffType } from "./buffsData";
import { TimeComponent } from "../time/TimeComponent"; // Adjust path
import { CharacterSleepStateComponent } from "../buildings/dormitory/CharacterSleepStateComponent";

export class SleepEffectsSystem extends System {
    public componentsRequired = new Set<Function>([ActionIntentComponent]);
    private worldTimeEntity: Entity | null = null;

    private getCurrentTimeMinutes(ecs: ECS): number | null {
        if (this.worldTimeEntity === null || !ecs.hasEntity(this.worldTimeEntity)) {
            const timeEntities = ecs.getEntitiesWithComponent(TimeComponent);
            this.worldTimeEntity = timeEntities.length > 0 ? timeEntities[0] : null;
        }
        if (!this.worldTimeEntity) return null;
        return ecs.getComponent(this.worldTimeEntity, TimeComponent).minutesElapsed;
    }

    public update(entities: Set<Entity>, delta: number): void {
        const currentTimeMinutes = this.getCurrentTimeMinutes(this.ecs);
        if (currentTimeMinutes === null) return;

        for (const entity of entities) {
            const actionIntent = this.ecs.getComponent(entity, ActionIntentComponent);
            const sleepState = this.ecs.getComponent(entity, CharacterSleepStateComponent);

            if (actionIntent.currentPerformedAction === CharacterAction.SLEEPING) {
                if (!sleepState) {
                    this.ecs.addComponent(entity, new CharacterSleepStateComponent(currentTimeMinutes));
                }
            } else { // Not currently SLEEPING
                if (sleepState) {
                    // Was sleeping, but no longer is. Apply buff if duration was sufficient.
                    const sleepDurationMinutes = currentTimeMinutes - sleepState.sleepStartTimeMinutes;
                    if (sleepDurationMinutes >= MIN_SLEEP_DURATION_FOR_RESTED_BUFF_MINUTES) {
                        let activeBuffs = this.ecs.getComponent(entity, ActiveBuffsComponent);
                        if (!activeBuffs) {
                            activeBuffs = new ActiveBuffsComponent();
                            this.ecs.addComponent(entity, activeBuffs);
                        }
                        activeBuffs.addBuff(BuffType.RESTED, currentTimeMinutes);
                    }
                    this.ecs.removeComponent(entity, CharacterSleepStateComponent);
                }
            }
        }
    }
}