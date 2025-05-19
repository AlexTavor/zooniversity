import { ECS, Entity } from "../../../ECS";
import { ActionIntentComponent } from "../ActionIntentComponent";
import {
    CharacterAction,
    ActionDataType,
    WalkingData,
    SleepingData,
    CharacterIntent,
    BlockedIntentReason
} from "../actionIntentData";
import { Transform } from "../../../components/Transform";
import { InteractionSlots, SlotType } from "../../work/InteractionSlots";
import { DormitoryComponent } from "../../buildings/dormitory/DormitoryComponent";
import { Pos } from "../../../../utils/Math";
import { LocomotionComponent } from "../../locomotion/LocomotionComponent"; 
import { BlockedIntentComponent } from "../BlockedIntentComponent";

function setIdle(aic: ActionIntentComponent): void {
    aic.currentPerformedAction = CharacterAction.IDLE;
    aic.actionData = null;
}

function setBlocked(ecs: ECS, entity: Entity, aic: ActionIntentComponent, reason: BlockedIntentReason, originalIntent: CharacterIntent, specificTargetId?: Entity): void {
    if (!ecs.hasComponent(entity, BlockedIntentComponent)) {
        ecs.addComponent(entity, new BlockedIntentComponent(originalIntent, reason, specificTargetId));
    }
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
    releaseAnySleepSlotHeldByCharacter(ecs, characterEntity);
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

// This "canResume" function is for BlockedIntentSystem and performs read-only checks.
export function canResumeSleepIntent(ecs: ECS, entity: Entity, bic: BlockedIntentComponent): boolean {
    const allDormitories = ecs.getEntitiesWithComponents([DormitoryComponent, InteractionSlots]);
    for (const dormitoryId of allDormitories) {
        if (bic.specificBlockedTargetId && dormitoryId !== bic.specificBlockedTargetId) continue;
        if (isDormitoryFunctionallyValid(ecs, dormitoryId)) {
            const slots = ecs.getComponent(dormitoryId, InteractionSlots);
            if (slots.getSlotsArray(SlotType.SLEEP).some(slot => slot.occupiedBy === null || slot.occupiedBy === entity)) {
                return true;
            }
        }
    }
    return false;
}

export function handleSleepIntentLogic(
    ecs: ECS,
    entity: Entity,
    actionIntent: ActionIntentComponent
): void {
    const characterTransform = ecs.getComponent(entity, Transform);
    if (!characterTransform) return setIdle(actionIntent);

    const targetInfo = findAndReserveNewSleepTarget(ecs, entity);

    if (!targetInfo) {
        setBlocked(ecs, entity, actionIntent, BlockedIntentReason.SLOT_UNAVAILABLE, CharacterIntent.SLEEP);
        return;
    }
    
    const locomotion = ecs.getComponent(entity, LocomotionComponent);

    const { bedEntityId, slotOffset, bedBuildingTransform } = targetInfo;

    if (!locomotion.arrived) {
        if (actionIntent.currentPerformedAction == CharacterAction.WALKING) return;

        const exactSleepPosition = { 
            x: Math.round(bedBuildingTransform.x + slotOffset.x), 
            y: Math.round(bedBuildingTransform.y + slotOffset.y) 
        };

        setWalkingToSlot(actionIntent, exactSleepPosition, bedEntityId);
    } else { 
        if (actionIntent.currentPerformedAction == CharacterAction.SLEEPING) return;

        setSleeping(actionIntent, bedEntityId, slotOffset);
    }
}