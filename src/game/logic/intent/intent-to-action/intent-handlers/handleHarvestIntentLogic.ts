import { ECS, Entity } from "../../../../ECS";
import { ActionIntentComponent } from "../ActionIntentComponent";
import {
    CharacterAction,
    ActionDataType,
    WalkingData,
    ChoppingData,
    CharacterIntent
} from "../actionIntentData";
import { Transform } from "../../../../components/Transform";
import { Tree } from "../../../trees/Tree";
import { HarvestableComponent } from "../../../trees/HarvestableComponent";
import { InteractionSlots, SlotType } from "../../../../components/InteractionSlots";
import { Pos } from "../../../../../utils/Math";
import { WoodDojoWorker } from "../../../buildings/wood_dojo/WoodDojoWorker";
import { getCaveTreeLUT } from "../../../lut/getCaveTreeLUT";
import { HarvestingState } from "../../character-states/HarvestingState";
import { abortHarvesting } from "../intent-abort/abortHarvesting";
import { LocomotionComponent } from "../../../locomotion/LocomotionComponent";
import { turnToTarget } from "../../../locomotion/turnToTarget";

function setIdle(aic: ActionIntentComponent): void {
    aic.intentType = CharacterIntent.NONE;
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

export function findAndReserveNewHarvestTarget(
    ecs: ECS,
    characterEntity: Entity
): boolean {
    abortHarvesting(ecs, characterEntity);

    const workerInfo = ecs.getComponent(characterEntity, WoodDojoWorker);
    if (!workerInfo || workerInfo.dojoId === null || workerInfo.dojoId === undefined) {
        return false; 
    }
    const assignedDojoId = workerInfo.dojoId;

    if (!ecs.hasEntity(assignedDojoId)) {
        return false; 
    }

    const caveTreeLUTComponent = getCaveTreeLUT(ecs); // Get the global LUT component
    if (!caveTreeLUTComponent || !caveTreeLUTComponent.lut) {
        return false; 
    }
    
    const nearbyTreeIds = caveTreeLUTComponent.lut[assignedDojoId];

    if (nearbyTreeIds && nearbyTreeIds.length > 0) {
        for (const treeId of nearbyTreeIds) {
            if (!ecs.hasEntity(treeId)) continue;

            if (isTreeValidForHarvest(ecs, treeId)) {
                const slots = ecs.getComponent(treeId, InteractionSlots);
                const transform = ecs.getComponent(treeId, Transform);

                if (!slots || !transform)
                    return false; // No interaction slots or transform, cannot harvest
                
                const offset = slots.reserve(characterEntity, SlotType.WORK);
                if (!offset) {
                    continue; // No available slot, try next tree
                }

                const targetPos = { x: offset.x + transform.x, y: offset.y + transform.y };
                const harvesting = ecs.getComponent(characterEntity, HarvestingState) ?? new HarvestingState(treeId, targetPos);
                harvesting.target = treeId;
                harvesting.targetPos = targetPos;

                !ecs.hasComponent(characterEntity, HarvestingState) && ecs.addComponent(characterEntity, harvesting);

                return true; // Successfully reserved a slot for harvesting
            }
        }
    }

    return false;
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
    const harvesting = ecs.getComponent(entity, HarvestingState);

    if (!harvesting || harvesting.target == -1){
        if (!findAndReserveNewHarvestTarget(ecs, entity)){
            setWaitingOrBlocked(actionIntent);
        }
        return;
    }

    updateActions(ecs, entity, actionIntent, harvesting);
}

function updateActions(ecs: ECS, entity:number, actionIntent: ActionIntentComponent, harvesting: HarvestingState): void {
    const { target:treeId, targetPos } = harvesting;
    if (treeId == -1 || !targetPos) {
        setIdle(actionIntent);
        return;
    }

    const locomotion = ecs.getComponent(entity, LocomotionComponent);

    if (!locomotion) {
        setIdle(actionIntent); // No locomotion component, cannot proceed
        return;
    }

    if (!locomotion.arrived) {
        setWalkingToSlot(actionIntent, targetPos, treeId);
    } else if (actionIntent.currentPerformedAction !== CharacterAction.CHOPPING && actionIntent.actionData?.targetTreeEntityId !== treeId) {
        // Arrived at the designated WORK slot for the target tree.
        setChopping(actionIntent, treeId);
        turnToTarget(ecs, entity, treeId);
    }
}


