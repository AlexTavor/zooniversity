// src/game/logic/action-intent/intent-handlers/handleForageIntentLogic.ts
import { ECS, Entity } from "../../../../ECS";
import { ActionIntentComponent } from "../ActionIntentComponent";
import {
    CharacterAction,
    ActionDataType,
    WalkingData,
    CharacterIntent,
    ForagingActionData,
    // ForagingActionData and isForagingActionData should be defined in actionIntentData.ts
} from "../actionIntentData";
import { Transform } from "../../../../components/Transform";
import { LocomotionComponent } from "../../../locomotion/LocomotionComponent";
import { Pos, MathUtils } from "../../../../../utils/Math"; // MathUtils for distance
import { ForagableComponent } from "../../../foraging/ForagableComponent";

function setIdleAndClearIntent(aic: ActionIntentComponent): void {
    aic.currentPerformedAction = CharacterAction.IDLE;
    aic.intentType = CharacterIntent.NONE;
    aic.actionData = null;
}

function setNoForageTargetsAvailable(aic: ActionIntentComponent): void {
    // If no targets, character might rest or do something else low priority
    aic.intentType = CharacterIntent.REST;
    aic.currentPerformedAction = CharacterAction.IDLE;
    aic.actionData = null;
}

function setWalkingToForageTarget(aic: ActionIntentComponent, targetPosition: Pos, targetEntityId: Entity): void {
    aic.currentPerformedAction = CharacterAction.WALKING;
    aic.actionData = {
        type: ActionDataType.WalkingData,
        targetPosition,
        ultimateTargetEntityId: targetEntityId
    } as WalkingData;
}

function setForaging(aic: ActionIntentComponent, targetEntityId: Entity): void {
    aic.currentPerformedAction = CharacterAction.FORAGING;
    aic.actionData = {
        type: ActionDataType.ForagingActionData,
        targetForagableEntityId: targetEntityId
    } as ForagingActionData;
}

function findClosestAvailableForageTarget(ecs: ECS, characterTransform: Transform): { id: Entity, transform: Transform, component: ForagableComponent } | null {
    const foragableEntities = ecs.getEntitiesWithComponents([ForagableComponent, Transform]);
    let closestTarget: { id: Entity, transform: Transform, component: ForagableComponent } | null = null;
    let minDistanceSq = Infinity;

    for (const entityId of foragableEntities) {
        const foragableComponent = ecs.getComponent(entityId, ForagableComponent);
        if (foragableComponent.currentAmount > 0) {
            const targetTransform = ecs.getComponent(entityId, Transform);
            const distanceSq = MathUtils.distance(characterTransform, targetTransform) ** 2; // Using squared distance for efficiency
            if (distanceSq < minDistanceSq) {
                minDistanceSq = distanceSq;
                closestTarget = { id: entityId, transform: targetTransform, component: foragableComponent };
            }
        }
    }
    return closestTarget;
}

export function handleForageIntentLogic(
    ecs: ECS,
    entity: Entity,
    actionIntent: ActionIntentComponent
    // deltaTimeMs is not strictly needed by this handler for state transitions,
    // but ForagingSystem will need it.
): void {
    const characterTransform = ecs.getComponent(entity, Transform);
    const locomotion = ecs.getComponent(entity, LocomotionComponent);

    if (!characterTransform || !locomotion) {
        return setIdleAndClearIntent(actionIntent);
    }

    // If already foraging at a target, ForagingSystem handles it.
    // This logic is primarily for finding a target or pathing to it.
    const currentActionData = actionIntent.actionData as ForagingActionData | WalkingData;
    if (actionIntent.currentPerformedAction === CharacterAction.FORAGING &&
        (currentActionData as ForagingActionData)?.type === ActionDataType.ForagingActionData) {
        // Check if current target is still valid (e.g., not depleted by someone else)
        const targetForagable = ecs.getComponent((currentActionData as ForagingActionData).targetForagableEntityId, ForagableComponent);
        if (!targetForagable || targetForagable.currentAmount <= 0) {
            // Target depleted or gone, re-evaluate (find new target or stop)
            // For simplicity, let's make it re-evaluate by clearing current action.
            // A more advanced system might immediately search for a new target.
            actionIntent.actionData = null; 
            // Fall through to find a new target.
        } else {
             return; // Already foraging a valid target, ForagingSystem will do the work.
        }
    }


    const forageTargetInfo = findClosestAvailableForageTarget(ecs, characterTransform);

    if (!forageTargetInfo) {
        return setNoForageTargetsAvailable(actionIntent);
    }

    const { id: targetId, transform: targetTransform } = forageTargetInfo;

    if (locomotion.arrived &&
        actionIntent.currentPerformedAction === CharacterAction.WALKING &&
        (currentActionData as WalkingData)?.type === ActionDataType.WalkingData &&
        (currentActionData as WalkingData).ultimateTargetEntityId === targetId) {
        // Arrived at forage target
        return setForaging(actionIntent, targetId);
    } else if (actionIntent.currentPerformedAction !== CharacterAction.WALKING || (currentActionData as WalkingData)?.ultimateTargetEntityId !== targetId) {
        // Not at target and not already walking to this specific target, so start walking
        // TODO: Path to an available InteractionSlot if ForagableComponent uses them
        setWalkingToForageTarget(actionIntent, { x: targetTransform.x, y: targetTransform.y }, targetId);
    }
    // If already walking to the correct target, LocomotionSystem handles it.
}