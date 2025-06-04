import { ECS, Entity } from "../../../../ECS";
import { ActionIntentComponent } from "../ActionIntentComponent";
import {
    CharacterAction,
    ActionDataType,
    WalkingData,
    CharacterIntent,
    ForagingActionData
} from "../actionIntentData";
import { Transform } from "../../../../components/Transform";
import { Pos } from "../../../../../utils/Math";
import { ForagableComponent } from "../../../foraging/ForagableComponent";
import { WoodDojoWorker } from "../../../buildings/wood_dojo/WoodDojoWorker";
import { HomeComponent } from "../../../buildings/dormitory/HomeComponent";
import { InteractionSlots, SlotType } from "../../../../components/InteractionSlots";
import { WoodDojo } from "../../../buildings/wood_dojo/WoodDojo"; // Placeholder for KitchenComponent
import { getCaveTreeLUT } from "../../../lut/getCaveTreeLUT";
import { ForagingState } from "../../character-states/ForagingState";
import { abortForaging } from "../intent-abort/abortForaging";
import { ForageRegenComponent } from "../../../foraging/ForageRegenComponent";

function setIdle(aic: ActionIntentComponent): void {
    aic.intentType = CharacterIntent.NONE;
    aic.currentPerformedAction = CharacterAction.IDLE;
    aic.actionData = null;
}

function setNoForageTargetsAvailable(aic: ActionIntentComponent): void {
    aic.intentType = CharacterIntent.REST; // Fallback intent
    aic.currentPerformedAction = CharacterAction.IDLE;
    aic.actionData = null;
}

function setWalkingToForageSlot(aic: ActionIntentComponent, targetPosition: Pos, targetEntityId: Entity): void {
    aic.currentPerformedAction = CharacterAction.WALKING;
    aic.actionData = {
        type: ActionDataType.WalkingData,
        targetPosition,
        ultimateTargetEntityId: targetEntityId
    } as WalkingData;
}

function setForagingAction(aic: ActionIntentComponent, targetEntityId: Entity, slotOffset: Pos): void {
    aic.currentPerformedAction = CharacterAction.FORAGING;
    aic.actionData = {
        type: ActionDataType.ForagingActionData,
        targetForagableEntityId: targetEntityId,
        slotOffset // Storing relative offset as per other similar actions
    } as ForagingActionData; // Cast to ForagingActionData, ensure it's defined
}

function getPrimaryForagingReferencePoint(ecs: ECS, characterEntity: Entity): Entity | null {
    const workerInfo = ecs.getComponent(characterEntity, WoodDojoWorker);
    if (workerInfo && workerInfo.dojoId !== null && ecs.hasEntity(workerInfo.dojoId)) {
        if (ecs.hasComponent(workerInfo.dojoId, WoodDojo)) { // Replace WoodDojo with actual KitchenComponent if it's distinct
            return workerInfo.dojoId;
        }
    }
    const home = ecs.getComponent(characterEntity, HomeComponent);
    if (home && home.homeEntityId !== null && ecs.hasEntity(home.homeEntityId)) {
        return home.homeEntityId;
    }
    return null;
}

export function canForage(ecs: ECS, characterEntity: Entity): boolean {
    const referenceEntityId = getPrimaryForagingReferencePoint(ecs, characterEntity);
    if (referenceEntityId === null) {
        return false; // No valid reference point (Kitchen or Dormitory) to forage from
    }

    const caveTreeLUTComponent = getCaveTreeLUT(ecs);
    if (!caveTreeLUTComponent || !caveTreeLUTComponent.lut) {
        return false; // LUT not available
    }

    const nearbyEntityIds = caveTreeLUTComponent.lut[referenceEntityId];

    if (nearbyEntityIds && nearbyEntityIds.length > 0) {
        for (const entityId of nearbyEntityIds) {
            if (!ecs.hasEntity(entityId)) continue;

            const foragableComponent = ecs.getComponent(entityId, ForagableComponent);
            const slots = ecs.getComponent(entityId, InteractionSlots);

            if (foragableComponent && foragableComponent.currentAmount == foragableComponent.maxAmount && slots) {
                // Check if ANY forage slot is available or already occupied by this character
                if (slots.getSlotsArray(SlotType.FORAGE).some(slot => slot.occupiedBy === null || slot.occupiedBy === characterEntity)) {
                    return true; // Found a valid, available foragable entity with a free slot
                }
            }
        }
    }
    return false; // No suitable target found
}

function findAndAssignForageTarget(ecs: ECS, characterEntity: Entity): boolean {
    abortForaging(ecs, characterEntity);

    const referenceEntityId = getPrimaryForagingReferencePoint(ecs, characterEntity);
    if (referenceEntityId === null) return false;

    const caveTreeLUTComponent = getCaveTreeLUT(ecs);
    if (!caveTreeLUTComponent || !caveTreeLUTComponent.lut) return false;

    const nearbyEntityIds = caveTreeLUTComponent.lut[referenceEntityId];

    if (nearbyEntityIds && nearbyEntityIds.length > 0) {
        for (const entityId of nearbyEntityIds) {
            if (!ecs.hasEntity(entityId)) continue;
            if (ecs.hasComponent(entityId, ForageRegenComponent)){
                continue;
            }

            const foragableComp = ecs.getComponent(entityId, ForagableComponent);
            const targetTransform = ecs.getComponent(entityId, Transform);
            const slots = ecs.getComponent(entityId, InteractionSlots);

            if (foragableComp && foragableComp.currentAmount > 0.2 && targetTransform && slots) {
                const offset = slots.reserve(characterEntity, SlotType.FORAGE);
                if (offset) {
                    const targetPosition = {
                        x: Math.round(targetTransform.x + offset.x),
                        y: Math.round(targetTransform.y + offset.y)
                    };
                    let foragingState = ecs.getComponent(characterEntity, ForagingState);
                    if (!foragingState) {
                        foragingState = new ForagingState(entityId, targetPosition);
                        ecs.addComponent(characterEntity, foragingState);
                    } else {
                        foragingState.targetForagableEntityId = entityId;
                        foragingState.targetPosition = targetPosition;
                    }
                    return true;
                }
            }
        }
    }
    return false;
}

function updateForageActions(ecs: ECS, entity: Entity, actionIntent: ActionIntentComponent, foragingState: ForagingState): void {
    const characterTransform = ecs.getComponent(entity, Transform);
    
    const { targetForagableEntityId: targetId, targetPosition: exactTargetPosition } = foragingState;

    if (targetId === -1 || !exactTargetPosition) {
        return setIdle(actionIntent);
    }
    if (!ecs.hasEntity(targetId) || (ecs.getComponent(targetId, ForagableComponent)?.currentAmount || 0) <= 0) {
        // Target became invalid after assignment (e.g. depleted by another)
        abortForaging(ecs, entity); // Abort will clear ForagingState, leading to re-search next tick
        actionIntent.currentPerformedAction = CharacterAction.IDLE; // Prevent immediate re-pathing this tick
        actionIntent.actionData = null;
        return;
    }


    if (!characterTransform) return setIdle(actionIntent);

    const roundedCharX = Math.round(characterTransform.x);
    const roundedCharY = Math.round(characterTransform.y);

    if (roundedCharX !== exactTargetPosition.x || roundedCharY !== exactTargetPosition.y) {
        setWalkingToForageSlot(actionIntent, exactTargetPosition, targetId);
    } else {
        // Arrived at the designated FORAGE slot.
        // The ForagingActionData needs the relative slotOffset, not the world position
        const targetTransform = ecs.getComponent(targetId, Transform);
        const slotOffset: Pos = {
            x: exactTargetPosition.x - targetTransform.x,
            y: exactTargetPosition.y - targetTransform.y
        };
        setForagingAction(actionIntent, targetId, slotOffset);
    }
}

export function handleForageIntentLogic(
    ecs: ECS,
    entity: Entity,
    actionIntent: ActionIntentComponent
): void {
    const foragingState = ecs.getComponent(entity, ForagingState);

    if (!foragingState || foragingState.targetForagableEntityId === -1) {
        if (!findAndAssignForageTarget(ecs, entity)) {
            setNoForageTargetsAvailable(actionIntent);
        }
        // If a target was found, ForagingState is now populated.
        // Next tick will call updateForageActions.
        // Or, re-fetch and proceed immediately if desired:
        const newlyAssignedState = ecs.getComponent(entity, ForagingState);
        if (newlyAssignedState && newlyAssignedState.targetForagableEntityId !== -1) {
            updateForageActions(ecs, entity, actionIntent, newlyAssignedState);
        }
        return;
    }

    const forageableComponent = ecs.getComponent(foragingState.targetForagableEntityId, ForagableComponent);
    if (!forageableComponent || forageableComponent.currentAmount <= 0) {
        abortForaging(ecs, entity);
        return;
    }

    updateForageActions(ecs, entity, actionIntent, foragingState);
}