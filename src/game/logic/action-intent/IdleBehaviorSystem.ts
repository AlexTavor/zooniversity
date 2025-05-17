import { System, Entity } from "../../ECS";
import { TimeComponent } from "../time/TimeComponent";
import { ActionIntentComponent } from "./ActionIntentComponent";
import { WaitingStateComponent } from "./WaitingStateComponent";
import { CharacterAction, CharacterIntent } from "./actionIntentData";

const MAX_WAIT_DURATION_MINUTES = 15; // Example: If waiting longer than 15 game minutes, switch to REST.

export class IdleBehaviorSystem extends System {
    public componentsRequired = new Set<Function>([ActionIntentComponent]);

    public update(entities: Set<Entity>, delta: number): void {
        const timeEntity = this.ecs.getEntitiesWithComponent(TimeComponent)[0];
        if (!timeEntity) return; // Requires TimeComponent to function
        const time = this.ecs.getComponent(timeEntity, TimeComponent);
        const currentTimeInMinutes = time.minutesElapsed;

        for (const entity of entities) {
            const actionIntent = this.ecs.getComponent(entity, ActionIntentComponent);
            const waitingState = this.ecs.getComponent(entity, WaitingStateComponent);

            if (actionIntent.currentPerformedAction === CharacterAction.WAITING) {
                if (!waitingState) {
                    // Character just started waiting for their current primary intent.
                    // Only add WaitingStateComponent if the intent is a primary task, not already REST or NONE.
                    if (actionIntent.intentType !== CharacterIntent.REST && 
                        actionIntent.intentType !== CharacterIntent.NONE) {
                        this.ecs.addComponent(entity, new WaitingStateComponent(
                            currentTimeInMinutes,
                            actionIntent.intentType 
                        ));

                        actionIntent.schduleOverrideStartHour = time.hour;
                    }
                } else {
                    // Character is already in a waiting state. Check duration.
                    if (currentTimeInMinutes - waitingState.waitStartTime >= MAX_WAIT_DURATION_MINUTES) {
                        // Waited too long, switch to REST.
                        actionIntent.intentType = CharacterIntent.REST;
                        actionIntent.currentPerformedAction = CharacterAction.IDLE; // Let IntentActionSystem derive new action
                        actionIntent.actionData = null;
                        this.ecs.removeComponent(entity, WaitingStateComponent);
                    }
                }
            } else {
                // Character is NOT currently WAITING. If they have a WaitingStateComponent, remove it.
                if (waitingState) {
                    this.ecs.removeComponent(entity, WaitingStateComponent);
                }
            }
        }
    }
}