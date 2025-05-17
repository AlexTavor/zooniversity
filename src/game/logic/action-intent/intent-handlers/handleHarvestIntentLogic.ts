import { ECS, Entity } from "../../../ECS";
import { ActionIntentComponent } from "../ActionIntentComponent";
import {
    CharacterAction,
    ActionDataType,
    WalkingData,
    ChoppingData,
    isChoppingData,
    isWalkingData
} from "../actionIntentData";
import { LocomotionComponent } from "../../locomotion/LocomotionComponent";
import { Transform } from "../../../components/Transform";
import { Harvester } from "../../work/Harvester";
import { Tree } from "../../trees/Tree";
import { Harvestable } from "../../work/Harvestable";
import { InteractionSlots, SlotType } from "../../work/InteractionSlots";
import { Pos } from "../../../../utils/Math";

function setIdle(aic: ActionIntentComponent): void {
    aic.currentPerformedAction = CharacterAction.IDLE;
    aic.actionData = null;
}

function setWaiting(aic: ActionIntentComponent): void {
    aic.currentPerformedAction = CharacterAction.WAITING;
    aic.actionData = null;
}

function setWalkingToSlot(aic: ActionIntentComponent, targetPosition: Pos, ultimateTargetId: Entity): void {
    aic.currentPerformedAction = CharacterAction.WALKING;
    aic.actionData = {
        type: ActionDataType.WalkingData,
        targetPosition, // Locomotion aims for this exact spot
        ultimateTargetEntityId: ultimateTargetId
    } as WalkingData;
}

function setChopping(aic: ActionIntentComponent, treeId: Entity): void {
    aic.currentPerformedAction = CharacterAction.CHOPPING;
    aic.actionData = {
        type: ActionDataType.ChoppingData,
        targetTreeEntityId: treeId
    } as ChoppingData;
}

function isTreeValidForHarvest(ecs: ECS, treeId: Entity): boolean {
    if (!ecs.hasEntity(treeId)) return false;
    const tree = ecs.getComponent(treeId, Tree);
    const harvestable = ecs.getComponent(treeId, Harvestable);
    return !!(tree && tree.selectedForCutting && harvestable && harvestable.harvestable && !harvestable.harvested);
}

function releaseAnyWorkSlotHeldByCharacter(ecs: ECS, characterEntity: Entity): void {
    const allTreesWithSlots = ecs.getEntitiesWithComponents([Tree, InteractionSlots]);
    for (const treeId of allTreesWithSlots) {
        ecs.getComponent(treeId, InteractionSlots)?.release(characterEntity, SlotType.WORK);
    }
}

function findAndReserveNewHarvestTarget(ecs: ECS, characterEntity: Entity): { treeId: Entity, slotOffset: Pos, treeTransform: Transform } | null {
    releaseAnyWorkSlotHeldByCharacter(ecs, characterEntity);
    const allTrees = ecs.getEntitiesWithComponents([Tree, Harvestable, InteractionSlots, Transform]);
    for (const treeId of allTrees) {
        if (isTreeValidForHarvest(ecs, treeId)) {
            const slots = ecs.getComponent(treeId, InteractionSlots);
            const offset = slots.reserve(characterEntity, SlotType.WORK);
            if (offset) {
                return { treeId, slotOffset: offset, treeTransform: ecs.getComponent(treeId, Transform) };
            }
        }
    }
    return null;
}

function getValidatedCurrentTargetInfo(ecs: ECS, entity: Entity, aic: ActionIntentComponent): { treeId: Entity, slotOffset: Pos, treeTransform: Transform } | null {
    let currentTargetTreeId: Entity | null = null;
    if (isWalkingData(aic.actionData) && aic.actionData.ultimateTargetEntityId) {
        currentTargetTreeId = aic.actionData.ultimateTargetEntityId;
    } else if (isChoppingData(aic.actionData)) {
        currentTargetTreeId = aic.actionData.targetTreeEntityId;
    }

    if (currentTargetTreeId !== null && isTreeValidForHarvest(ecs, currentTargetTreeId)) {
        const slots = ecs.getComponent(currentTargetTreeId, InteractionSlots);
        const workSlots = slots?.getSlotsArray(SlotType.WORK) || []; 
        const heldSlot = workSlots.find(slot => slot.occupiedBy === entity);
        if (heldSlot) {
            return { treeId: currentTargetTreeId, slotOffset: { x: heldSlot.x, y: heldSlot.y }, treeTransform: ecs.getComponent(currentTargetTreeId, Transform) };
        }
    }
    return null;
}

export function handleHarvestIntentLogic(
    ecs: ECS,
    entity: Entity,
    actionIntent: ActionIntentComponent
): void {
    const locomotion = ecs.getComponent(entity, LocomotionComponent);
    const harvester = ecs.getComponent(entity, Harvester);

    if (!locomotion || !harvester) return setIdle(actionIntent);

    let validatedTargetInfo = getValidatedCurrentTargetInfo(ecs, entity, actionIntent);

    if (!validatedTargetInfo) {
        const newTarget = findAndReserveNewHarvestTarget(ecs, entity);
        if (newTarget) {
            validatedTargetInfo = newTarget;
            locomotion.arrived = false;
            actionIntent.actionData = null; 
        } else {
            return setWaiting(actionIntent);
        }
    }
    
    const { treeId, slotOffset, treeTransform } = validatedTargetInfo;
    const exactApproachPosition = { x: treeTransform.x + slotOffset.x, y: treeTransform.y + slotOffset.y };

    if (!locomotion.arrived) {
        setWalkingToSlot(actionIntent, exactApproachPosition, treeId);
    } else {
        setChopping(actionIntent, treeId);
    }
}