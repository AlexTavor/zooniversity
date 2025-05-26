import { ECS, Entity } from "../../../ECS";
import { ActionIntentComponent } from "../ActionIntentComponent";
import {
    CharacterAction,
    ActionDataType,
    WalkingData,
    ChoppingData,
    CharacterIntent
} from "../actionIntentData";
import { Transform } from "../../../components/Transform";
import { HarvesterComponent } from "../../trees/HarvesterComponent";
import { Tree } from "../../trees/Tree";
import { HarvestableComponent } from "../../trees/HarvestableComponent";
import { InteractionSlots, SlotType } from "../../../components/InteractionSlots";
import { Pos } from "../../../../utils/Math";

function setIdle(aic: ActionIntentComponent): void {
    aic.currentPerformedAction = CharacterAction.IDLE;
    aic.actionData = null;
}

function setWaitingOrBlocked(aic: ActionIntentComponent): void {
    aic.intentType = CharacterIntent.REST;
    aic.currentPerformedAction = CharacterAction.IDLE; 
    aic.actionData = null;
}

function setWalkingToSlot(aic: ActionIntentComponent, targetPosition: Pos, ultimateTargetId: Entity): void {
    aic.currentPerformedAction = CharacterAction.WALKING;
    aic.actionData = {
        type: ActionDataType.WalkingData,
        targetPosition,
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
    const harvestable = ecs.getComponent(treeId, HarvestableComponent);
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
    const allTrees = ecs.getEntitiesWithComponents([Tree, HarvestableComponent, InteractionSlots, Transform]);

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

export function canHarvest(ecs: ECS, entity: Entity): boolean {
    const allTrees = ecs.getEntitiesWithComponents([Tree, HarvestableComponent, InteractionSlots]);
    for (const treeId of allTrees) {
        if (isTreeValidForHarvest(ecs, treeId)) {
            const slots = ecs.getComponent(treeId, InteractionSlots);
            // Check if ANY work slot is available, without reserving it.
            if (slots.getSlotsArray(SlotType.WORK).some(slot => slot.occupiedBy === null || slot.occupiedBy === entity)) {
                return true;
            }
        }
    }
    return false;
}


export function handleHarvestIntentLogic(
    ecs: ECS,
    entity: Entity,
    actionIntent: ActionIntentComponent
): void {
    const characterTransform = ecs.getComponent(entity, Transform);
    const harvester = ecs.getComponent(entity, HarvesterComponent);

    if (!characterTransform || !harvester) return setIdle(actionIntent);

    const targetInfo = findAndReserveNewHarvestTarget(ecs, entity);

    if (!targetInfo) {
        setWaitingOrBlocked(actionIntent,);
        return;
    }
    
    const { treeId, slotOffset, treeTransform } = targetInfo;
    const exactApproachPosition = { 
        x: Math.round(treeTransform.x + slotOffset.x), 
        y: Math.round(treeTransform.y + slotOffset.y) 
    };
    
    const roundedCharX = Math.round(characterTransform.x);
    const roundedCharY = Math.round(characterTransform.y);

    if (roundedCharX !== exactApproachPosition.x || roundedCharY !== exactApproachPosition.y) {
        setWalkingToSlot(actionIntent, exactApproachPosition, treeId);
    } else {
        // Arrived at the designated WORK slot for the target tree.
        setChopping(actionIntent, treeId);
    }
}