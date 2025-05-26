import { ECS, Entity } from "../../../ECS";
import { ActionIntentComponent } from "../ActionIntentComponent";
import {
    CharacterAction,
    ActionDataType,
    WalkingData,
    SleepingData,
    CharacterIntent
} from "../actionIntentData";
import { Transform } from "../../../components/Transform";
import { InteractionSlots, SlotType } from "../../../components/InteractionSlots";
import { DormitoryComponent } from "../../buildings/dormitory/DormitoryComponent";
import { Pos } from "../../../../utils/Math";
import { LocomotionComponent } from "../../locomotion/LocomotionComponent"; 

function setIdle(aic: ActionIntentComponent): void {
    aic.currentPerformedAction = CharacterAction.IDLE;
    aic.actionData = null;
}

function setBlocked(aic: ActionIntentComponent): void {
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

export function canSleep(ecs: ECS, entity: Entity): boolean {
    const allDormitories = ecs.getEntitiesWithComponents([DormitoryComponent, InteractionSlots]);
    for (const dormitoryId of allDormitories) {
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
        setBlocked(actionIntent);
        return;
    }
    
    const locomotion = ecs.getComponent(entity, LocomotionComponent);

    const { bedEntityId, slotOffset, bedBuildingTransform } = targetInfo;

    if (locomotion.arrived){
        if (actionIntent.currentPerformedAction == CharacterAction.SLEEPING) return;

        setSleeping(actionIntent, bedEntityId, slotOffset);
        return;
    }

    if (actionIntent.currentPerformedAction != CharacterAction.WALKING) {
        const exactSleepPosition = { 
            x: Math.round(bedBuildingTransform.x + slotOffset.x), 
            y: Math.round(bedBuildingTransform.y + slotOffset.y) 
        };
    
        setWalkingToSlot(actionIntent, exactSleepPosition, bedEntityId);
    }
}