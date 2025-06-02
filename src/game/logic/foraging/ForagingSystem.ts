import { System, Entity, ECS } from "../../ECS";
import { ForagableComponent } from "./ForagableComponent";
import { ResourceTracker } from "../resources/ResourceTracker";
import { StatCalculator } from "../buffs/StatCalculator";
import { AffectedStat } from "../buffs/buffsData"; 
import { InteractionSlots, SlotType } from "../../components/InteractionSlots"; 
import { getDeltaInGameMinutes } from "../../display/utils/getDeltaInGameMinutes";
import { ActionIntentComponent } from "../intent/intent-to-action/ActionIntentComponent";
import { CharacterAction, ForagingActionData, ActionDataType, CharacterIntent } from "../intent/intent-to-action/actionIntentData";

function releaseForageSlot(ecs: ECS, characterEntity: Entity, foragableEntityId: Entity): void {
    if (ecs.hasEntity(foragableEntityId) && ecs.hasComponent(foragableEntityId, InteractionSlots)) {
        ecs.getComponent(foragableEntityId, InteractionSlots)?.release(characterEntity, SlotType.FORAGE);
    }
}

export class ForagingSystem extends System {
    public componentsRequired = new Set<Function>([ActionIntentComponent]);

    public update(entities: Set<Entity>, deltaMs: number): void {
        const gameMinutesPassedThisFrame = getDeltaInGameMinutes(this.ecs, deltaMs);
        if (gameMinutesPassedThisFrame === 0) return;

        for (const characterEntity of entities) {
            const actionIntent = this.ecs.getComponent(characterEntity, ActionIntentComponent);

            if (actionIntent.currentPerformedAction !== CharacterAction.FORAGING ||
                (actionIntent.actionData as ForagingActionData)?.type !== ActionDataType.ForagingActionData) {
                continue;
            }

            const foragingData = actionIntent.actionData as ForagingActionData;
            const targetEntityId = foragingData.targetForagableEntityId;

            if (!this.ecs.hasEntity(targetEntityId)) {
                releaseForageSlot(this.ecs, characterEntity, targetEntityId);
                actionIntent.intentType = CharacterIntent.FORAGE; // Re-evaluate for new target
                actionIntent.currentPerformedAction = CharacterAction.IDLE;
                actionIntent.actionData = null;
                continue;
            }

            const foragableNode = this.ecs.getComponent(targetEntityId, ForagableComponent);

            if (!foragableNode || foragableNode.currentAmount <= 0) {
                releaseForageSlot(this.ecs, characterEntity, targetEntityId);
                actionIntent.intentType = CharacterIntent.FORAGE; // Node depleted, re-evaluate
                actionIntent.currentPerformedAction = CharacterAction.IDLE;
                actionIntent.actionData = null;
                continue;
            }

            const baseYieldFromNodeThisFrame = foragableNode.yieldPerMinute * gameMinutesPassedThisFrame;
            
            // Apply character's yield multiplier (e.g., from Kitchen worker buff)
            const characterYieldMultiplier = StatCalculator.getEffectiveStat(
                this.ecs,
                characterEntity,
                AffectedStat.FOOD_GATHERING_YIELD_MULTIPLIER
            );

            // Amount actually taken cannot exceed what's available on the node
            const amountTakenFromNode = Math.min(baseYieldFromNodeThisFrame, foragableNode.currentAmount);

            if (amountTakenFromNode > 0) {
                foragableNode.currentAmount -= amountTakenFromNode;
                ResourceTracker.add(foragableNode.resourceType, amountTakenFromNode * characterYieldMultiplier);
            }

            if (foragableNode.currentAmount <= 0) {
                releaseForageSlot(this.ecs, characterEntity, targetEntityId);
                actionIntent.intentType = CharacterIntent.FORAGE; // Node depleted, re-evaluate
                actionIntent.currentPerformedAction = CharacterAction.IDLE;
                actionIntent.actionData = null;
            }
        }
    }
}