import { ECS, Entity } from "../../../../ECS";
import { ActionIntentComponent } from "../ActionIntentComponent";
import {
    CharacterAction,
    ActionDataType,
    WalkingData,
    CharacterIntent,
} from "../actionIntentData";
import { Transform } from "../../../../components/Transform";
import { LocomotionComponent } from "../../../locomotion/LocomotionComponent";
import { Pos } from "../../../../../utils/Math";
import { NeedsComponent, NeedType } from "../../../needs/NeedsComponent";
import { ResourceTracker } from "../../../resources/ResourceTracker";
import { ResourceType } from "../../../resources/ResourceType";
import { BuffType } from "../../../buffs/buffsData";
import { getTime } from "../../../time/TimeComponent";
import { BuffsComponent } from "../../../buffs/BuffsComponent";

const FOOD_UNITS_CONSUMED_AT_ACTION_START = 1;

function setIdleAndClearIntent(aic: ActionIntentComponent): void {
    aic.currentPerformedAction = CharacterAction.IDLE;
    aic.intentType = CharacterIntent.NONE;
    aic.actionData = null;
}

function setForageIntent(aic: ActionIntentComponent): void {
    aic.intentType = CharacterIntent.FORAGE; // Ensure this is in CharacterIntent enum
    aic.currentPerformedAction = CharacterAction.IDLE;
    aic.actionData = null;
}

function setWalkingToKitchen(
    aic: ActionIntentComponent,
    targetPosition: Pos,
    kitchenEntityId: Entity,
): void {
    aic.currentPerformedAction = CharacterAction.WALKING;
    aic.actionData = {
        type: ActionDataType.WalkingData,
        targetPosition,
        ultimateTargetEntityId: kitchenEntityId,
    } as WalkingData;
}

function applyEatingBuffAndSetAction(
    ecs: ECS,
    entity: Entity,
    aic: ActionIntentComponent,
): void {
    ResourceTracker.add(
        ResourceType.FOOD,
        -FOOD_UNITS_CONSUMED_AT_ACTION_START,
    );

    let buffs = ecs.getComponent(entity, BuffsComponent);
    if (!buffs) {
        buffs = new BuffsComponent();
        ecs.addComponent(entity, buffs);
    }
    const time = getTime(ecs);
    buffs.addBuff(BuffType.EATING, time ? time.minutesElapsed : 0);

    aic.currentPerformedAction = CharacterAction.EATING;
    aic.actionData = { type: ActionDataType.EatingData };
}

function getKitchenInfo(
    _ecs: ECS,
): { id: Entity; transform: Transform } | null {
    return null;
}

export function handleEatIntentLogic(
    ecs: ECS,
    entity: Entity,
    actionIntent: ActionIntentComponent,
): void {
    const activeBuffs = ecs.getComponent(entity, BuffsComponent);
    const isEatingBuffActive = activeBuffs?.hasBuff(BuffType.EATING) || false;

    if (isEatingBuffActive) {
        return;
    }

    const locomotion = ecs.getComponent(entity, LocomotionComponent);
    const needs = ecs.getComponent(entity, NeedsComponent);

    if (!locomotion || !needs) return setIdleAndClearIntent(actionIntent);

    const foodNeed = needs.need(NeedType.FOOD);

    if (
        !foodNeed ||
        (foodNeed.current >= foodNeed.max && !isEatingBuffActive)
    ) {
        return setIdleAndClearIntent(actionIntent);
    }

    if (actionIntent.currentPerformedAction === CharacterAction.EATING) {
        return setIdleAndClearIntent(actionIntent);
    }

    if (
        ResourceTracker.get(ResourceType.FOOD) <
        FOOD_UNITS_CONSUMED_AT_ACTION_START
    ) {
        return setForageIntent(actionIntent);
    }

    const kitchenInfo = getKitchenInfo(ecs);

    if (kitchenInfo) {
        const { id: kitchenId, transform: kitchenTransform } = kitchenInfo;
        const walkingData = actionIntent.actionData as WalkingData;

        if (
            locomotion?.arrived &&
            walkingData?.ultimateTargetEntityId === kitchenId
        ) {
            // Arrived at kitchen for eating
            applyEatingBuffAndSetAction(ecs, entity, actionIntent);
        } else if (
            actionIntent.currentPerformedAction !== CharacterAction.WALKING ||
            walkingData?.ultimateTargetEntityId !== kitchenId
        ) {
            setWalkingToKitchen(
                actionIntent,
                { x: kitchenTransform.x, y: kitchenTransform.y },
                kitchenId,
            );
        }
    } else {
        // No kitchen, eat on the spot
        applyEatingBuffAndSetAction(ecs, entity, actionIntent);
    }
}
