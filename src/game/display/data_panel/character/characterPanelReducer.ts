import { ECS, Entity } from "../../../ECS";
import { TimeConfig } from "../../../config/TimeConfig";
import { ActionIntentComponent } from "../../../logic/intent/intent-to-action/ActionIntentComponent";
import { StrollComponent } from "../../../logic/intent/intent-to-action/relaxation/StrollComponent";
import {
    CharacterIntent,
    CharacterAction,
    isChoppingData,
    isSleepingData,
    isStrollingAtPointData,
    isWalkingData,
} from "../../../logic/intent/intent-to-action/actionIntentData";
import { StatCalculator } from "../../../logic/buffs/StatCalculator";
import { AffectedStat } from "../../../logic/buffs/buffsData";
import { DormitoryComponent } from "../../../logic/buildings/dormitory/DormitoryComponent";
import { WoodDojo } from "../../../logic/buildings/wood_dojo/WoodDojo";
import { ScheduleComponent } from "../../../logic/characters/ScheduleComponent";
import { NeedType, NeedsComponent } from "../../../logic/needs/NeedsComponent";
import { getTime } from "../../../logic/time/TimeComponent";
import { Tree } from "../../../logic/trees/Tree";
import { deriveBuffs } from "./deriveBuffs";

const NeedTypeToStatMap = new Map<NeedType, AffectedStat>([
    [NeedType.FOOD, AffectedStat.HUNGER_MODIFICATION_RATE],
    [NeedType.SLEEP, AffectedStat.SLEEP_MODIFICATION_RATE],
]);

export function characterPanelReducer(entity: Entity, ecs: ECS): unknown {
    const actionIntent = ecs.getComponent(entity, ActionIntentComponent);
    const schedule = ecs.getComponent(entity, ScheduleComponent);
    const needs = ecs.getComponent(entity, NeedsComponent);
    const time = getTime(ecs);
    const hour = time.hour;

    if (!actionIntent || !schedule) {
        return {
            currentStatusText: "Awaiting assignment",
            currentPerformedAction: CharacterAction.IDLE,
            currentScheduleIndex: hour,
            currentScheduleText: "No schedule",
            scheduleIconTypes: [],
        };
    }

    const needsData = [...needs.needs].map(([key, value]) => ({
        type: key.toString(),
        current: Math.floor(value.current),
        max: Math.floor(value.max),
        changeRatePerHour: (
            StatCalculator.getEffectiveStat(
                ecs,
                entity,
                NeedTypeToStatMap.get(key)!,
            ) * TimeConfig.HoursPerDay
        ).toFixed(2),
    }));

    return {
        currentAction: {
            type: actionIntent.currentPerformedAction,
            description: actionToString[actionIntent.currentPerformedAction],
        },
        schedule: { currentSlotIndex: hour, slots: schedule.entries },
        needs: needsData,
        statusEffects: deriveBuffs(ecs, entity, time.minutesElapsed),
        currentStatusText: deriveCurrentStatusText(ecs, entity, actionIntent),
        entity,
    };
}

export enum CharacterScheduleIconType {
    HARVEST = "Harvest",
    SLEEP = "Sleep",
    STUDY = "Study",
    REST = "Rest",
    BUILD = "Build",
    NONE = "None",
}

function getStatusTextForRest(
    ecs: ECS,
    entity: Entity,
    aic: ActionIntentComponent,
): string {
    const strollComp = ecs.getComponent(entity, StrollComponent);
    if (strollComp) {
        if (
            aic.currentPerformedAction === CharacterAction.WALKING &&
            isWalkingData(aic.actionData) &&
            aic.actionData.ultimateTargetEntityId
        ) {
            return `Strolling towards ${getEntityName(ecs, aic.actionData.ultimateTargetEntityId)}`;
        } else if (
            aic.currentPerformedAction === CharacterAction.STROLLING &&
            isStrollingAtPointData(aic.actionData)
        ) {
            return `Enjoying nature near ${getEntityName(ecs, aic.actionData.atTreeEntityId)}`;
        }
        return "Having a relaxing stroll";
    }
    return "Taking personal time";
}

function getStatusTextForHarvest(
    ecs: ECS,
    _entity: Entity,
    aic: ActionIntentComponent,
): string {
    if (
        aic.currentPerformedAction === CharacterAction.WALKING &&
        isWalkingData(aic.actionData) &&
        aic.actionData.ultimateTargetEntityId
    ) {
        return `Walking to ${getEntityName(ecs, aic.actionData.ultimateTargetEntityId)} to harvest`;
    } else if (
        aic.currentPerformedAction === CharacterAction.CHOPPING &&
        isChoppingData(aic.actionData)
    ) {
        return `Chopping ${getEntityName(ecs, aic.actionData.targetTreeEntityId)}`;
    } else if (aic.currentPerformedAction === CharacterAction.NONE) {
        return "Waiting for available tree";
    }
    return "Preparing to harvest";
}

function getStatusTextForSleep(
    ecs: ECS,
    _entity: Entity,
    aic: ActionIntentComponent,
): string {
    if (
        aic.currentPerformedAction === CharacterAction.WALKING &&
        isWalkingData(aic.actionData) &&
        aic.actionData.ultimateTargetEntityId
    ) {
        return `Going to bed at ${getEntityName(ecs, aic.actionData.ultimateTargetEntityId)}`;
    } else if (
        aic.currentPerformedAction === CharacterAction.SLEEPING &&
        isSleepingData(aic.actionData)
    ) {
        return `Sleeping in ${getEntityName(ecs, aic.actionData.bedEntityId)}`;
    } else if (aic.currentPerformedAction === CharacterAction.NONE) {
        return "Waiting for a bed";
    }
    return "Preparing for bed";
}

function deriveCurrentStatusText(
    ecs: ECS,
    entity: Entity,
    actionIntent: ActionIntentComponent,
): string {
    switch (actionIntent.intentType) {
        case CharacterIntent.REST:
            return getStatusTextForRest(ecs, entity, actionIntent);
        case CharacterIntent.HARVEST:
            return getStatusTextForHarvest(ecs, entity, actionIntent);
        case CharacterIntent.SLEEP:
            return getStatusTextForSleep(ecs, entity, actionIntent);
        case CharacterIntent.NONE:
            return "Contemplating.";
        default: {
            const actionString = (
                Object.keys(CharacterAction) as Array<
                    keyof typeof CharacterAction
                >
            ).find(
                (key) =>
                    CharacterAction[key] ===
                    actionIntent.currentPerformedAction,
            );
            return actionString ? `${actionString}` : "Engaged in a task";
        }
    }
}

function getEntityName(ecs: ECS, entityId: Entity | null | undefined): string {
    if (entityId === null || entityId === undefined || !ecs.hasEntity(entityId))
        return "an unknown place";
    if (ecs.hasComponent(entityId, Tree)) return "a tree";
    if (ecs.hasComponent(entityId, WoodDojo)) return "the Wood Dojo";
    if (ecs.hasComponent(entityId, DormitoryComponent)) return "the Dormitory";
    return `location #${entityId}`;
}

const actionToString: Record<CharacterAction, string> = {
    [CharacterAction.IDLE]: "Idle",
    [CharacterAction.WALKING]: "Walking",
    [CharacterAction.CHOPPING]: "Chopping",
    [CharacterAction.BUILDING]: "Building",
    [CharacterAction.STUDYING]: "Studying",
    [CharacterAction.SLEEPING]: "Sleeping",
    [CharacterAction.STROLLING]: "Resting",
    [CharacterAction.RELAXING]: "Resting",
    [CharacterAction.NONE]: "None",
    [CharacterAction.EATING]: "Eating",
    [CharacterAction.FORAGING]: "Foraging",
};
