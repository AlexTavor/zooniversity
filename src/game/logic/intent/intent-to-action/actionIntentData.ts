import { Entity } from "../../../ECS";
import { Pos } from "../../../../utils/Math";

/** Defines the high-level goal or scheduled task for a character. */

export enum CharacterIntent {
    NONE = "NONE",
    HARVEST = "HARVEST",
    BUILD = "BUILD",
    SLEEP = "SLEEP",
    REST = "REST",
    EAT = "EAT",
    STUDY = "STUDY",
    FORAGE_FOOD = "FORAGE_FOOD"
}

/** Defines the concrete, observable, low-level action a character is currently performing. */

export enum CharacterAction {
    IDLE = "Idle",
    WALKING = "Walking",
    CHOPPING = "Chopping",
    BUILDING = "Building",
    STUDYING = "Studying",
    SLEEPING = "Sleeping",
    STROLLING = "Strolling",// Covers walking during stroll and pausing at stroll points
    RELAXING = "Relaxing",
    NONE = "None",
    EATING = "EATING"
}

/** Enum to discriminate between different actionData payload structures. */

export enum ActionDataType {
    WalkingData,
    ChoppingData,
    SleepingData,
    StrollingAtPointData,
    EatingData
}

// --- Payload Interfaces for ActionIntentComponent.actionData ---
export interface WalkingData {
    readonly type: ActionDataType.WalkingData;
    targetPosition: Pos;
    ultimateTargetEntityId?: Entity;
}

export interface ChoppingData {
    readonly type: ActionDataType.ChoppingData;
    targetTreeEntityId: Entity;
}

export interface SleepingData {
    readonly type: ActionDataType.SleepingData;
    bedEntityId: Entity;
    slotOffset: Pos;
}

export interface StrollingAtPointData {
    readonly type: ActionDataType.StrollingAtPointData;
    atTreeEntityId: Entity; // The tree/point they are currently at
}

export interface EatingData {
    readonly type: ActionDataType.EatingData; 
}

// --- Type Guards for ActionData Payloads ---

export function isEatingData(data: any): data is EatingData {
    return data?.type === ActionDataType.EatingData;
}

export function isWalkingData(data: any): data is WalkingData {
    return data?.type === ActionDataType.WalkingData &&
           data.targetPosition !== undefined;
}

export function isChoppingData(data: any): data is ChoppingData {
    return data?.type === ActionDataType.ChoppingData &&
           typeof data.targetTreeEntityId === 'number';
}

export function isSleepingData(data: any): data is SleepingData {
    return data?.type === ActionDataType.SleepingData;
}

export function isStrollingAtPointData(data: any): data is StrollingAtPointData {
    return data?.type === ActionDataType.StrollingAtPointData;
}