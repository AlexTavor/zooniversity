// src/game/logic/action-intent/intent-handlers/handleSleepIntentLogic.ts
import { ECS, Entity } from "../../../../ECS";
import { ActionIntentComponent } from "../ActionIntentComponent";
import {
    CharacterAction,
    ActionDataType,
    WalkingData,
    SleepingData, // This is for actionIntent.actionData
    CharacterIntent,
} from "../actionIntentData";
import { Transform } from "../../../../components/Transform";
import {
    InteractionSlots,
    SlotType,
} from "../../../../components/InteractionSlots";
import { DormitoryComponent } from "../../../buildings/dormitory/DormitoryComponent";
import { Pos } from "../../../../../utils/Math";
import { abortSleeping } from "../intent-abort/abortSleeping"; // New helper
import { SleepingState } from "../../character-states/SleepingState";
import { LocomotionComponent } from "../../../locomotion/LocomotionComponent";

function setIdle(aic: ActionIntentComponent): void {
    aic.intentType = CharacterIntent.NONE;
    aic.currentPerformedAction = CharacterAction.IDLE;
    aic.actionData = null;
}

function setWalkingToSlot(
    aic: ActionIntentComponent,
    targetPosition: Pos,
    ultimateTargetId: Entity,
): void {
    aic.currentPerformedAction = CharacterAction.WALKING;
    aic.actionData = {
        type: ActionDataType.WalkingData,
        targetPosition,
        ultimateTargetEntityId: ultimateTargetId,
    } as WalkingData;
}

function setSleepingAction(
    aic: ActionIntentComponent,
    bedEntityId: Entity,
    slotOffset: Pos,
): void {
    aic.currentPerformedAction = CharacterAction.SLEEPING;
    aic.actionData = {
        type: ActionDataType.SleepingData, // Ensure this is defined in ActionDataType
        bedEntityId,
        slotOffset,
    } as SleepingData;
}

export function canSleep(_ecs: ECS, _entity: Entity): boolean {
    return true; // Placeholder for any conditions that might prevent sleeping
}

function findAndAssignBed(ecs: ECS, characterEntity: Entity): boolean {
    abortSleeping(ecs, characterEntity); // Clear previous assignment and release slot

    const allDormitories = ecs.getEntitiesWithComponents([
        DormitoryComponent,
        InteractionSlots,
        Transform,
    ]);

    for (const dormitoryId of allDormitories) {
        const slots = ecs.getComponent(dormitoryId, InteractionSlots);

        const offset = slots.reserve(characterEntity, SlotType.SLEEP);
        if (offset) {
            const transform = ecs.getComponent(dormitoryId, Transform);
            const targetPosition = {
                x: transform.x + offset.x,
                y: transform.y + offset.y,
            };

            let sleeping = ecs.getComponent(characterEntity, SleepingState);
            if (!sleeping) {
                sleeping = new SleepingState(dormitoryId, targetPosition);
                ecs.addComponent(characterEntity, sleeping);
            } else {
                sleeping.targetBedEntityId = dormitoryId;
                sleeping.targetPosition = targetPosition;
            }
            return true; // Successfully assigned a bed
        }
    }
    return false; // No bed found or slot reserved
}

export function handleSleepIntentLogic(
    ecs: ECS,
    entity: Entity,
    actionIntent: ActionIntentComponent,
): void {
    const sleeping = ecs.getComponent(entity, SleepingState);

    if (!sleeping) {
        if (!findAndAssignBed(ecs, entity)) {
            setIdle(actionIntent);
        }
        return;
    }

    const locomotion = ecs.getComponent(entity, LocomotionComponent);

    if (!locomotion) {
        setIdle(actionIntent); // No locomotion component, cannot proceed
        return;
    }

    if (!locomotion.arrived) {
        setWalkingToSlot(
            actionIntent,
            sleeping.targetPosition!,
            sleeping.targetBedEntityId,
        );
    } else {
        setSleepingAction(
            actionIntent,
            sleeping.targetBedEntityId,
            sleeping.targetPosition!,
        );
    }
}
