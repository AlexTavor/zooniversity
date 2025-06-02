import { System, Entity } from "../../../ECS";
import { ActionIntentComponent } from "./ActionIntentComponent";
import { CharacterIntent, CharacterAction } from "./actionIntentData";
import { handleEatIntentLogic } from "./intent-handlers/handleEatIntentLogic";
import { handleForageIntentLogic } from "./intent-handlers/handleForageIntentLogic";
import { handleHarvestIntentLogic } from "./intent-handlers/handleHarvestIntentLogic";
import { handleRestIntentLogic } from "./intent-handlers/handleRestIntentLogic";
import { handleSleepIntentLogic } from "./intent-handlers/handleSleepIntentLogic";
import { abortHarvesting } from "./intent-abort/abortHarvesting";
import { abortSleeping } from "./intent-abort/abortSleeping";
import { abortForaging } from "./intent-abort/abortForaging";

export class ActionIntentSystem extends System {
    public componentsRequired = new Set<Function>([ActionIntentComponent]);
    public lastIntent:CharacterIntent;

    public update(entities: Set<Entity>, delta: number): void {
        for (const entity of entities) {
            const actionIntent = this.ecs.getComponent(entity, ActionIntentComponent);
            const currentIntent = actionIntent.intentType;
            if (this.lastIntent !== currentIntent) {
                switch (this.lastIntent) {
                    case CharacterIntent.HARVEST:
                        abortHarvesting(this.ecs, entity);
                        break;
                    case CharacterIntent.SLEEP:
                        abortSleeping(this.ecs, entity);
                        break;
                    case CharacterIntent.FORAGE:
                        abortForaging(this.ecs, entity);
                        break;
                    case CharacterIntent.REST:
                    case CharacterIntent.EAT:
                    default:
                        break;
                }
            }

            this.lastIntent = currentIntent;

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
                case CharacterIntent.EAT:
                    handleEatIntentLogic(this.ecs, entity, actionIntent);
                    break;
                case CharacterIntent.FORAGE:
                    handleForageIntentLogic(this.ecs, entity, actionIntent);
                    break;
                default:
                    actionIntent.currentPerformedAction = CharacterAction.IDLE;
                    actionIntent.actionData = null;
                    break;
            }
        }
    }
}