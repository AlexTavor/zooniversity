import { System, Entity } from "../../ECS";
import { ActionIntentComponent } from "./ActionIntentComponent";
import { CharacterIntent, CharacterAction } from "./actionIntentData";
import { handleHarvestIntentLogic } from "./intent-handlers/handleHarvestIntentLogic";
import { handleRestIntentLogic } from "./intent-handlers/handleRestIntentLogic";
import { handleSleepIntentLogic } from "./intent-handlers/handleSleepIntentLogic";

export class ActionIntentSystem extends System {
    public componentsRequired = new Set<Function>([ActionIntentComponent]);

    // To track if an intent has changed, requiring actionData cleanup by the new helper.
    private lastIntentTypeCache: Map<Entity, CharacterIntent> = new Map();

    public update(entities: Set<Entity>, delta: number): void {
        for (const entity of entities) {
            const actionIntent = this.ecs.getComponent(entity, ActionIntentComponent);
            const currentIntent = actionIntent.intentType;
            const previousIntent = this.lastIntentTypeCache.get(entity);

            if (currentIntent !== previousIntent && previousIntent !== undefined) {
                // Intent has changed, the new helper is responsible for setting appropriate actionData.
                // Explicitly nullifying here ensures no stale data if a helper doesn't set it.
                actionIntent.actionData = null; 
            }

            switch (currentIntent) {
                case CharacterIntent.HARVEST:
                    handleHarvestIntentLogic(this.ecs, entity, actionIntent);
                    break;
                case CharacterIntent.SLEEP:
                    handleSleepIntentLogic(this.ecs, entity, actionIntent);
                    break;
                case CharacterIntent.REST:
                    handleRestIntentLogic(this.ecs, entity, actionIntent);
                    break;
                default:
                    // Unhandled intent, ensure a sane default action state
                    if (actionIntent.currentPerformedAction !== CharacterAction.IDLE) {
                        actionIntent.currentPerformedAction = CharacterAction.IDLE;
                    }
                    if (actionIntent.actionData !== null) {
                        actionIntent.actionData = null;
                    }
                    break;
            }
            this.lastIntentTypeCache.set(entity, currentIntent);
        }

        // Cleanup cache for destroyed entities
        const currentEntities = new Set(entities);
        for (const entityId of this.lastIntentTypeCache.keys()) {
            if (!currentEntities.has(entityId)) {
                this.lastIntentTypeCache.delete(entityId);
            }
        }
    }
}