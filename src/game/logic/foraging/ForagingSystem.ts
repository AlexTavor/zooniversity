import { System, Entity } from "../../ECS";
import { ForagableComponent } from "./ForagableComponent";
import { ResourceTracker } from "../resources/ResourceTracker";
import { StatCalculator } from "../buffs/StatCalculator";
import { AffectedStat } from "../buffs/buffsData";
import { getDeltaInGameMinutes } from "../../display/utils/getDeltaInGameMinutes";
import { ActionIntentComponent } from "../intent/intent-to-action/ActionIntentComponent";
import {
    CharacterAction,
    ForagingActionData,
    ActionDataType,
} from "../intent/intent-to-action/actionIntentData";
import { abortForaging } from "../intent/intent-to-action/intent-abort/abortForaging";

export class ForagingSystem extends System {
    public componentsRequired = new Set<Function>([ActionIntentComponent]);

    public update(entities: Set<Entity>, deltaMs: number): void {
        const gameMinutesPassedThisFrame = getDeltaInGameMinutes(
            this.ecs,
            deltaMs,
        );
        if (gameMinutesPassedThisFrame === 0) return;

        for (const characterEntity of entities) {
            const actionIntent = this.ecs.getComponent(
                characterEntity,
                ActionIntentComponent,
            );

            if (
                actionIntent.currentPerformedAction !==
                    CharacterAction.FORAGING ||
                (actionIntent.actionData as ForagingActionData)?.type !==
                    ActionDataType.ForagingActionData
            ) {
                continue;
            }

            const foragingData = actionIntent.actionData as ForagingActionData;
            const targetEntityId = foragingData.targetForagableEntityId;

            if (!this.ecs.hasEntity(targetEntityId)) {
                abortForaging(this.ecs, characterEntity);
                continue;
            }

            const foragableNode = this.ecs.getComponent(
                targetEntityId,
                ForagableComponent,
            );

            if (!foragableNode || foragableNode.currentAmount <= 0) {
                abortForaging(this.ecs, characterEntity);
                continue;
            }

            const baseYieldFromNodeThisFrame =
                StatCalculator.getEffectiveStat(
                    this.ecs,
                    characterEntity,
                    AffectedStat.FORAGING_SPEED,
                ) * gameMinutesPassedThisFrame;

            // Apply character's yield multiplier (e.g., from Kitchen worker buff)
            const characterYieldMultiplier = StatCalculator.getEffectiveStat(
                this.ecs,
                characterEntity,
                AffectedStat.FOOD_GATHERING_YIELD_MULTIPLIER,
            );

            // Amount actually taken cannot exceed what's available on the node
            const amountTakenFromNode = Math.min(
                baseYieldFromNodeThisFrame,
                foragableNode.currentAmount,
            );

            if (amountTakenFromNode > 0) {
                foragableNode.currentAmount -= amountTakenFromNode;
                ResourceTracker.add(
                    foragableNode.resourceType,
                    amountTakenFromNode * characterYieldMultiplier,
                );
            }

            if (foragableNode.currentAmount <= 0) {
                abortForaging(this.ecs, characterEntity);
            }
        }
    }
}
