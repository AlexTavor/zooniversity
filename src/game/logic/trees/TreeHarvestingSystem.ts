import { System, Entity, ECS } from "../../ECS";
import { ActionIntentComponent } from "../action-intent/ActionIntentComponent";
import { CharacterAction, isChoppingData } from "../action-intent/actionIntentData";
import { HarvestableComponent } from "./HarvestableComponent";
import { HarvesterComponent } from "./HarvesterComponent"; // For harvest speed/ability
import { TimeComponent } from "../time/TimeComponent";
import { ResourceComponent } from "../resources/ResourceComponent";
import { ResourceType } from "../resources/ResourceType";
import { InteractionSlots } from "../work/InteractionSlots";
import { Tree } from "../trees/Tree";

export class TreeHarvestingSystem extends System {
    public componentsRequired = new Set<Function>([
        ActionIntentComponent,
        HarvesterComponent
    ]);

    public update(entities: Set<Entity>, delta: number): void {
        const timeEntity = this.ecs.getEntitiesWithComponent(TimeComponent)[0];
        if (!timeEntity) return; // No time, no progress

        const time = this.ecs.getComponent(timeEntity, TimeComponent);
        if (time.speedFactor === 0) return; // Game paused
        
        const scaledDeltaSeconds = (delta / 1000) * time.speedFactor;

        for (const characterEntity of entities) {
            const actionIntent = this.ecs.getComponent(characterEntity, ActionIntentComponent);

            if (actionIntent.currentPerformedAction !== CharacterAction.CHOPPING || 
                !isChoppingData(actionIntent.actionData)) {
                continue;
            }

            const choppingData = actionIntent.actionData; // Known to be ChoppingData
            const targetTreeId = choppingData.targetTreeEntityId;

            if (!this.ecs.hasEntity(targetTreeId)) {
                this.abortHarvest(actionIntent, characterEntity, null);
                continue;
            }

            const tree = this.ecs.getComponent(targetTreeId, Tree);
            const harvestable = this.ecs.getComponent(targetTreeId, HarvestableComponent);
            const harvester = this.ecs.getComponent(characterEntity, HarvesterComponent);

            if (!tree || !harvestable || !harvester) {
                this.abortHarvest(actionIntent, characterEntity, targetTreeId, tree);
                continue;
            }

            // Re-validate conditions, though IntentActionSystem's helper should have ensured this.
            // This is a safety check.
            if (!tree.selectedForCutting || !harvestable.harvestable || harvestable.harvested) {
                this.abortHarvest(actionIntent, characterEntity, targetTreeId, tree);
                continue;
            }

            tree.isBeingCut = true;

            const harvestAmountThisFrame = harvester.harvestPerMinute * scaledDeltaSeconds;
            harvestable.amount -= harvestAmountThisFrame;

            if (harvestable.amount <= 0) {
                this.finalizeHarvest(this.ecs, harvestable, tree);
                this.finishHarvest(actionIntent, characterEntity, targetTreeId);
            }
        }
    }

    private finalizeHarvest(ecs: ECS, harvestable: HarvestableComponent, tree: Tree): void {
        harvestable.amount = 0;
        harvestable.harvested = true;
        harvestable.harvestable = false;
        tree.isBeingCut = false;
        tree.selectedForCutting = false;

        const resourcesEntity = ecs.getEntitiesWithComponent(ResourceComponent)[0];
        if (resourcesEntity) {
            const resources = ecs.getComponent(resourcesEntity, ResourceComponent);
            harvestable.drops.forEach((drop) => {
                resources.amounts[drop.type as ResourceType] = (resources.amounts[drop.type as ResourceType] || 0) + drop.amount;
            });
        }
    }

    private clearActionState(aic: ActionIntentComponent, characterEntity: Entity, treeId: Entity | null, treeComponent?: Tree) {
        if (treeComponent) treeComponent.isBeingCut = false;
        if (treeId !== null) {
            const slots = this.ecs.getComponent(treeId, InteractionSlots);
            slots?.releaseAll(characterEntity);
        }
        aic.currentPerformedAction = CharacterAction.IDLE;
        aic.actionData = null;
    }

    private abortHarvest(aic: ActionIntentComponent, characterEntity: Entity, treeId: Entity | null, tree?: Tree): void {
        this.clearActionState(aic, characterEntity, treeId, tree);
    }

    private finishHarvest(aic: ActionIntentComponent, characterEntity: Entity, treeId: Entity): void {
        this.clearActionState(aic, characterEntity, treeId, this.ecs.getComponent(treeId,Tree));
    }
}