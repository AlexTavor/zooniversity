import { System, Entity } from "../../ECS";
import { ActionIntentComponent } from "./ActionIntentComponent";
import { CharacterIntent, CharacterAction } from "./actionIntentData";
import { handleHarvestIntentLogic } from "./intent-handlers/handleHarvestIntentLogic";
import { handleRestIntentLogic } from "./intent-handlers/handleRestIntentLogic";
import { handleSleepIntentLogic } from "./intent-handlers/handleSleepIntentLogic";

export class ActionIntentSystem extends System {
    public componentsRequired = new Set<Function>([ActionIntentComponent]);

    public update(entities: Set<Entity>, delta: number): void {
        for (const entity of entities) {
            const actionIntent = this.ecs.getComponent(entity, ActionIntentComponent);
            const currentIntent = actionIntent.intentType;

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
                    actionIntent.currentPerformedAction = CharacterAction.IDLE;
                    actionIntent.actionData = null;
                    break;
            }
        }
    }
}