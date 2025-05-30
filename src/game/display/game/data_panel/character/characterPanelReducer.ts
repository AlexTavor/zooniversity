import { ECS, Entity } from "../../../../ECS";
import { ActionIntentComponent } from "../../../../logic/action-intent/ActionIntentComponent";
import { StrollComponent } from "../../../../logic/action-intent/StrollComponent";
import { CharacterIntent, CharacterAction, isChoppingData, isSleepingData, isStrollingAtPointData, isWalkingData } from "../../../../logic/action-intent/actionIntentData";
import { DormitoryComponent } from "../../../../logic/buildings/dormitory/DormitoryComponent";
import { HomeComponent } from "../../../../logic/buildings/dormitory/HomeComponent";
import { WoodDojo } from "../../../../logic/buildings/wood_dojo/WoodDojo";
import { ScheduleComponent } from "../../../../logic/characters/ScheduleComponent";
import { NeedsComponent } from "../../../../logic/needs/NeedsComponent";
import { TimeComponent } from "../../../../logic/time/TimeComponent";
import { Tree } from "../../../../logic/trees/Tree";
import { deriveBuffs } from "./deriveBuffs";


export function characterPanelReducer(entity: Entity, ecs: ECS): unknown {
    const actionIntent = ecs.getComponent(entity, ActionIntentComponent);
    const schedule = ecs.getComponent(entity, ScheduleComponent);
    const needs = ecs.getComponent(entity, NeedsComponent);
    const timeEntity = ecs.getEntitiesWithComponent(TimeComponent)[0];
    const time = ecs.getComponent(timeEntity, TimeComponent);
    const hour = time.hour;

    if (!actionIntent || !schedule) {
        return {
            currentStatusText: "Awaiting assignment",
            currentPerformedAction: CharacterAction.IDLE,
            currentScheduleIndex: hour,
            currentScheduleText: "No schedule",
            scheduleIconTypes: []
        };
    }

    const currentScheduledIntent = schedule.entries[hour] ?? CharacterIntent.NONE;

    return {
        currentAction: {type:actionIntent.currentPerformedAction, description:actionToString[actionIntent.currentPerformedAction]},
        schedule: {currentSlotIndex:hour, slots:schedule.entries},
        needs: [{type:"SLEEP", current:Math.floor(needs.sleep.current), max:Math.floor(needs.sleep.max), changeRatePerHour:0}],
        statusEffects:deriveBuffs(ecs, entity, time.minutesElapsed),
        currentStatusText: deriveCurrentStatusText(ecs, entity, actionIntent)
    }
}


export enum CharacterScheduleIconType {
    HARVEST = "Harvest", SLEEP = "Sleep", STUDY = "Study", REST = "Rest", BUILD = "Build", NONE = "None",
  }
  
function convertScheduleIntentToDisplayText(intent: CharacterIntent, ecs: ECS, entity: Entity): string {
    const home = ecs.getComponent(entity, HomeComponent);
    const homeName = home?.homeEntityId ? getEntityName(ecs, home.homeEntityId) : "their work area";
    switch (intent) {
        case CharacterIntent.HARVEST: return `Work @ ${homeName}`;
        case CharacterIntent.SLEEP:   return "Bed Time";
        case CharacterIntent.STUDY:   return "Studying";
        case CharacterIntent.REST:    return "Personal Time";
        case CharacterIntent.BUILD:   return `Building @ ${homeName}`;
        case CharacterIntent.NONE:    return "Free Time";
        default:                      return "Task";
    }
}

function convertScheduleIntentToIconType(intent: CharacterIntent): CharacterScheduleIconType {
    switch (intent) {
        case CharacterIntent.HARVEST: return CharacterScheduleIconType.HARVEST;
        case CharacterIntent.SLEEP:   return CharacterScheduleIconType.SLEEP;
        case CharacterIntent.STUDY:   return CharacterScheduleIconType.STUDY;
        case CharacterIntent.REST:    return CharacterScheduleIconType.REST;
        case CharacterIntent.BUILD:   return CharacterScheduleIconType.BUILD;
        default:                      return CharacterScheduleIconType.NONE;
    }
}

function getStatusTextForRest(ecs: ECS, entity: Entity, aic: ActionIntentComponent): string {
    const strollComp = ecs.getComponent(entity, StrollComponent);
    if (strollComp) {
        if (aic.currentPerformedAction === CharacterAction.WALKING && isWalkingData(aic.actionData) && aic.actionData.ultimateTargetEntityId) {
            return `Strolling towards ${getEntityName(ecs, aic.actionData.ultimateTargetEntityId)}`;
        } else if (aic.currentPerformedAction === CharacterAction.STROLLING && isStrollingAtPointData(aic.actionData)) {
            return `Enjoying nature near ${getEntityName(ecs, aic.actionData.atTreeEntityId)}`;
        }
        return "Having a relaxing stroll";
    }
    return "Taking personal time";
}

function getStatusTextForHarvest(ecs: ECS, entity: Entity, aic: ActionIntentComponent): string {
    if (aic.currentPerformedAction === CharacterAction.WALKING && isWalkingData(aic.actionData) && aic.actionData.ultimateTargetEntityId) {
        return `Walking to ${getEntityName(ecs, aic.actionData.ultimateTargetEntityId)} to harvest`;
    } else if (aic.currentPerformedAction === CharacterAction.CHOPPING && isChoppingData(aic.actionData)) {
        return `Chopping ${getEntityName(ecs, aic.actionData.targetTreeEntityId)}`;
    } else if (aic.currentPerformedAction === CharacterAction.NONE) {
        return "Waiting for available tree";
    }
    return "Preparing to harvest";
}

function getStatusTextForSleep(ecs: ECS, entity: Entity, aic: ActionIntentComponent): string {
    if (aic.currentPerformedAction === CharacterAction.WALKING && isWalkingData(aic.actionData) && aic.actionData.ultimateTargetEntityId) {
        return `Going to bed at ${getEntityName(ecs, aic.actionData.ultimateTargetEntityId)}`;
    } else if (aic.currentPerformedAction === CharacterAction.SLEEPING && isSleepingData(aic.actionData)) {
        return `Sleeping in ${getEntityName(ecs, aic.actionData.bedEntityId)}`;
    } else if (aic.currentPerformedAction === CharacterAction.NONE) {
        return "Waiting for a bed";
    }
    return "Preparing for bed";
}

function deriveCurrentStatusText(ecs: ECS, entity: Entity, actionIntent: ActionIntentComponent): string {
    switch (actionIntent.intentType) {
        case CharacterIntent.REST:    return getStatusTextForRest(ecs, entity, actionIntent);
        case CharacterIntent.HARVEST: return getStatusTextForHarvest(ecs, entity, actionIntent);
        case CharacterIntent.SLEEP:   return getStatusTextForSleep(ecs, entity, actionIntent);
        case CharacterIntent.NONE:    return "Contemplating.";
        default:{
            const actionString = (Object.keys(CharacterAction) as Array<keyof typeof CharacterAction>)
                .find(key => CharacterAction[key] === actionIntent.currentPerformedAction);
            return actionString ? `${actionString}` : "Engaged in a task";
          }
    }
}

function getEntityName(ecs: ECS, entityId: Entity | null | undefined): string {
    if (entityId === null || entityId === undefined || !ecs.hasEntity(entityId)) return "an unknown place";
    if (ecs.hasComponent(entityId, Tree)) return "a tree";
    if (ecs.hasComponent(entityId, WoodDojo)) return "the Wood Dojo";
    if (ecs.hasComponent(entityId, DormitoryComponent)) return "the Dormitory";
    return `location #${entityId}`;
}

const actionToString : Record<CharacterAction, string> = {
    [CharacterAction.IDLE]: "Idle",
    [CharacterAction.WALKING]: "Walking",
    [CharacterAction.CHOPPING]: "Chopping",
    [CharacterAction.BUILDING]: "Building",
    [CharacterAction.STUDYING]: "Studying",
    [CharacterAction.SLEEPING]: "Sleeping",
    [CharacterAction.STROLLING]: "Resting",
    [CharacterAction.RELAXING]: "Resting",
    [CharacterAction.NONE]: "None"
}
