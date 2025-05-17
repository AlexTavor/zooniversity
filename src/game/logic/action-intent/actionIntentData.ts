import { Entity } from "../../ECS";
import { Pos } from "../../../utils/Math";

/** Defines the high-level goal or scheduled task for a character. */
export enum CharacterIntent {
    NONE = 0,
    HARVEST = 1,
    BUILD = 2,
    SLEEP = 3,
    REST = 4,
    STUDY = 5,
}

/** Defines the concrete, observable, low-level action a character is currently performing. */
export enum CharacterAction {
    IDLE = "Idle",
    WALKING = "Walking",
    WAITING = "Waiting",
    CHOPPING = "Chopping",
    BUILDING = "Building",
    STUDYING = "Studying",
    SLEEPING = "Sleeping",
    STROLLING = "Strolling", // Covers walking during stroll and pausing at stroll points
    RELAXING = "Relaxing",
    NONE = "None",
}

/** Enum to discriminate between different actionData payload structures. */
export enum ActionDataType {
    WalkingData,
    ChoppingData,
    SleepingData,
    StrollingAtPointData,
    // Add other types as new action data payloads are created
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


// --- Type Guards for ActionData Payloads ---

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