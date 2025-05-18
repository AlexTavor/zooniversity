import { ECS, Entity, System } from "../../ECS";
import { ActionIntentComponent } from "./ActionIntentComponent";
import { BlockedIntentComponent } from "./BlockedIntentComponent";
import { CharacterIntent, CharacterAction } from "./actionIntentData";
import { canResumeHarvestIntent } from "./intent-handlers/handleHarvestIntentLogic";
import { canResumeSleepIntent } from "./intent-handlers/handleSleepIntentLogic";

// Placeholder type for these check functions
type CanResumeIntentLogic = (ecs: ECS, entity: Entity, blockedIntentComp: BlockedIntentComponent) => boolean;

export class BlockedIntentSystem extends System {
    public componentsRequired = new Set<Function>([ActionIntentComponent, BlockedIntentComponent]);

    private intentRecheckLogicMap: Map<CharacterIntent, CanResumeIntentLogic>;

    constructor() {
        super();
        // This map links an original blocked intent to its specific "can resume" check function.
        this.intentRecheckLogicMap = new Map([
            [CharacterIntent.HARVEST, canResumeHarvestIntent],
            [CharacterIntent.SLEEP, canResumeSleepIntent],
            // Add other mappings for intents that can be blocked and have re-check logic.
            // e.g., [CharacterIntent.BUILD, canResumeBuildIntent],
        ]);
    }

    public update(entities: Set<Entity>, delta: number): void {
        for (const entity of entities) {
            const actionIntent = this.ecs.getComponent(entity, ActionIntentComponent);
            const blockedIntent = this.ecs.getComponent(entity, BlockedIntentComponent); // Exists due to componentsRequired

            // Optional: Implement cooldown logic using blockedIntent.reCheckCooldown if needed,
            // to avoid checking every frame. For simplicity, checking every frame here.
            // if (blockedIntent.reCheckCooldown && blockedIntent.reCheckCooldown > 0) {
            //     blockedIntent.reCheckCooldown -= delta; // Assuming delta is in ms
            //     continue;
            // }

            const canResumeLogic = this.intentRecheckLogicMap.get(blockedIntent.originalIntentType);

            if (canResumeLogic && canResumeLogic(this.ecs, entity, blockedIntent)) {
                // The original blocked intent can now be resumed.
                actionIntent.intentType = blockedIntent.originalIntentType;
                actionIntent.currentPerformedAction = CharacterAction.IDLE; // Reset action
                actionIntent.actionData = null;                             // Clear previous action data

                this.ecs.removeComponent(entity, BlockedIntentComponent);
                
                // If the character was in a REST state (e.g., strolling) due to the block,
                // RelaxBehaviorSystem will detect the intentType change away from REST
                // and clean up StrollComponent, reset speed, etc., on its next update.
            }
            // If canResumeLogic returns false, the character remains in their current state
            // (likely REST, being handled by RelaxBehaviorSystem and handleRestIntentLogic).
            // The BlockedIntentComponent also remains.
        }
    }
}