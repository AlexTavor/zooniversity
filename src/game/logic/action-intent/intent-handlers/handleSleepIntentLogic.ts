// src/game/logic/action-intent/intent-helpers/handleSleepIntentLogic.ts

import { ECS, Entity } from "../../../ECS";
import { ActionIntentComponent } from "../ActionIntentComponent";
import {
    CharacterAction,
    ActionDataType,
    WalkingData,
    SleepingData,
    isSleepingData,
    isWalkingData
} from "../actionIntentData";
import { LocomotionComponent } from "../../locomotion/LocomotionComponent";
import { Transform } from "../../../components/Transform";
import { InteractionSlots, SlotType } from "../../work/InteractionSlots";
import { DormitoryComponent } from "../../buildings/dormitory/DormitoryComponent";
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
        targetPosition,
        ultimateTargetEntityId: ultimateTargetId
    } as WalkingData;
}

function setSleeping(aic: ActionIntentComponent, bedEntityId: Entity, slotOffset: Pos): void {
    aic.currentPerformedAction = CharacterAction.SLEEPING;
    aic.actionData = {
        type: ActionDataType.SleepingData,
        bedEntityId,
        slotOffset
    } as SleepingData;
}

function isDormitoryFunctionallyValid(ecs: ECS, dormitoryEntityId: Entity): boolean {
    if (!ecs.hasEntity(dormitoryEntityId)) return false;
    return ecs.hasComponent(dormitoryEntityId, DormitoryComponent) &&
           ecs.hasComponent(dormitoryEntityId, InteractionSlots);
}

function releaseAnySleepSlotHeldByCharacter(ecs: ECS, characterEntity: Entity): void {
    const allDormitories = ecs.getEntitiesWithComponents([DormitoryComponent, InteractionSlots]);
    for (const dormitoryId of allDormitories) {
        ecs.getComponent(dormitoryId, InteractionSlots)?.release(characterEntity, SlotType.SLEEP);
    }
}

function findAndReserveNewSleepTarget(ecs: ECS, characterEntity: Entity): { bedEntityId: Entity, slotOffset: Pos, bedBuildingTransform: Transform } | null {
    releaseAnySleepSlotHeldByCharacter(ecs, characterEntity); // Ensure no old slots are held by this char
    const allDormitories = ecs.getEntitiesWithComponents([DormitoryComponent, InteractionSlots, Transform]);
    
    for (const dormitoryId of allDormitories) {
        const slots = ecs.getComponent(dormitoryId, InteractionSlots);
        const offset = slots.reserve(characterEntity, SlotType.SLEEP);
        if (offset) {
            return { bedEntityId: dormitoryId, slotOffset: offset, bedBuildingTransform: ecs.getComponent(dormitoryId, Transform) };
        }
    }
    return null;
}

function getValidatedCurrentSleepTargetInfo(ecs: ECS, characterEntity: Entity, aic: ActionIntentComponent): { bedEntityId: Entity, slotOffset: Pos, bedBuildingTransform: Transform } | null {
    let currentTargetBedEntityId: Entity | null = null;

    if (isWalkingData(aic.actionData) && aic.actionData.ultimateTargetEntityId) {
        currentTargetBedEntityId = aic.actionData.ultimateTargetEntityId;
    } else if (isSleepingData(aic.actionData)) {
        currentTargetBedEntityId = aic.actionData.bedEntityId;
    }

    if (currentTargetBedEntityId !== null && isDormitoryFunctionallyValid(ecs, currentTargetBedEntityId)) {
        const slots = ecs.getComponent(currentTargetBedEntityId, InteractionSlots);
        const heldSlot = slots?.getSlotsArray(SlotType.SLEEP).find(slot => slot.occupiedBy === characterEntity);

        if (heldSlot) {
            return { bedEntityId: currentTargetBedEntityId, slotOffset: { x: heldSlot.x, y: heldSlot.y }, bedBuildingTransform: ecs.getComponent(currentTargetBedEntityId, Transform) };
        }
    }
    return null;
}

export function handleSleepIntentLogic(
    ecs: ECS,
    entity: Entity,
    actionIntent: ActionIntentComponent
): void {
    const locomotion = ecs.getComponent(entity, LocomotionComponent);
    if (!locomotion) return setIdle(actionIntent); 

    let validatedTargetInfo = getValidatedCurrentSleepTargetInfo(ecs, entity, actionIntent);
    let newTargetJustAcquired = false;

    if (!validatedTargetInfo) {
        const newTarget = findAndReserveNewSleepTarget(ecs, entity);
        if (newTarget) {
            validatedTargetInfo = newTarget;
            locomotion.arrived = false; 
            actionIntent.actionData = null;
            newTargetJustAcquired = true;
        } else {
            return setWaiting(actionIntent);
        }
    }
    
    const { bedEntityId, slotOffset, bedBuildingTransform } = validatedTargetInfo;
    const exactSleepPosition = { 
        x: bedBuildingTransform.x + slotOffset.x, 
        y: bedBuildingTransform.y + slotOffset.y 
    };

    if (!locomotion.arrived || newTargetJustAcquired) {
        // If a new target was just acquired, character needs to walk even if loco.arrived was true for a *previous different* target.
        // Also, ensure we set WalkingData if current actionData is not already for walking to this exact spot.
        const currentWalkData = actionIntent.actionData as WalkingData | null;
        if (newTargetJustAcquired || // Always walk if new target
            actionIntent.currentPerformedAction !== CharacterAction.WALKING || 
            !isWalkingData(currentWalkData) || 
            currentWalkData.ultimateTargetEntityId !== bedEntityId ||
            currentWalkData.targetPosition.x !== exactSleepPosition.x ||
            currentWalkData.targetPosition.y !== exactSleepPosition.y) {
                
            setWalkingToSlot(actionIntent, exactSleepPosition, bedEntityId);
        }
        // If already WALKING to this exact spot, let LocomotionSystem continue.
    } else { 
        // locomotion.arrived is true for the current target (the sleep slot)
        setSleeping(actionIntent, bedEntityId, slotOffset);
    }
}