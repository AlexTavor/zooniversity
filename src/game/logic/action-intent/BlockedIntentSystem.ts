import { ECS, Entity, System } from "../../ECS";
import { ActionIntentComponent } from "./ActionIntentComponent";
import { BlockedIntentComponent } from "./BlockedIntentComponent";
import { CharacterIntent, CharacterAction } from "./actionIntentData";
import { canResumeHarvestIntent } from "./intent-handlers/handleHarvestIntentLogic";
import { canResumeSleepIntent } from "./intent-handlers/handleSleepIntentLogic";

type CanResumeIntentLogic = (ecs: ECS, entity: Entity, blockedIntentComp: BlockedIntentComponent) => boolean;

export class BlockedIntentSystem extends System {
    public componentsRequired = new Set<Function>([ActionIntentComponent, BlockedIntentComponent]);

    private intentRecheckLogicMap: Map<CharacterIntent, CanResumeIntentLogic>;

    constructor() {
        super();
        this.intentRecheckLogicMap = new Map([
            [CharacterIntent.HARVEST, canResumeHarvestIntent],
            [CharacterIntent.SLEEP, canResumeSleepIntent],
        ]);
    }

    public update(entities: Set<Entity>, delta: number): void {
        for (const entity of entities) {
            const actionIntent = this.ecs.getComponent(entity, ActionIntentComponent);
            const blockedIntent = this.ecs.getComponent(entity, BlockedIntentComponent);

            const canResumeLogic = this.intentRecheckLogicMap.get(blockedIntent.originalIntentType);

            if (canResumeLogic && canResumeLogic(this.ecs, entity, blockedIntent)) {
                // The original blocked intent can now be resumed.
                actionIntent.intentType = blockedIntent.originalIntentType;
                actionIntent.currentPerformedAction = CharacterAction.IDLE; // Reset action
                actionIntent.actionData = null;                             // Clear previous action data

                this.ecs.removeComponent(entity, BlockedIntentComponent);
            }
        }
    }
}