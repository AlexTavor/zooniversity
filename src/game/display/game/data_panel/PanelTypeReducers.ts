import { Entity, ECS } from "../../../ECS";
import { Tree } from "../../../logic/components/Tree";
import { WoodDojo } from "../../../logic/components/WoodDojo";
import { LocomotionComponent } from "../../../logic/locomotion/LocomotionComponent";
import { ScheduleComponent } from "../../../logic/scheduling/ScheduleComponent";
import { TimeComponent } from "../../../logic/time/TimeComponent";
import { ActionIntentComponent, AgentActionType } from "../../../logic/work/ActionIntentComponent";
import { Harvestable } from "../../../logic/work/Harvestable";
import { PanelType } from "../../setup/ViewDefinition";

export type PanelTypeReducer = (entity: Entity, ecs: ECS) => unknown;

export enum CharacterAction {
  NONE = "None",
  WALKING = "Walking",
  CHOPPING = "Chopping",
  BUILDING = "Building",
  STUDYING = "Studying",
  WAITING = "Waiting",
  SLEEPING = "Sleeping",
  RELAXING = "Relaxing"
}

export enum CharacterScheduleType {
  HARVEST = "Harvest",
  SLEEP = "Sleep",
  STUDY = "Study",
  REST = "Rest"
}


function resolveCharacterAction(entity: Entity, ecs: ECS): CharacterAction {
  const intent = ecs.getComponent(entity, ActionIntentComponent);
  if (!intent) return CharacterAction.NONE;

  switch (intent.actionType) {
    case AgentActionType.HARVEST: {
      if (intent.targetEntityId === -1) return CharacterAction.WAITING;
      const locomotion = ecs.getComponent(entity, LocomotionComponent);
      if (!locomotion?.arrived) return CharacterAction.WALKING;
      return CharacterAction.CHOPPING;
    }

    case AgentActionType.SLEEP:
      return CharacterAction.SLEEPING;

    case AgentActionType.REST:
      return CharacterAction.RELAXING;

    default:
      return CharacterAction.NONE;
  }
}

const convertSchedule = (a: AgentActionType): CharacterScheduleType => {
  switch (a) {
    case AgentActionType.HARVEST: return CharacterScheduleType.HARVEST;
    case AgentActionType.SLEEP: return CharacterScheduleType.SLEEP;
    case AgentActionType.REST: return CharacterScheduleType.REST;
    case AgentActionType.STUDY: return CharacterScheduleType.STUDY;
    default: return CharacterScheduleType.REST;
  }
};

export const PanelTypeReducers: Partial<Record<PanelType, PanelTypeReducer>> = {
  [PanelType.CHARACTER]: (entity, ecs) => {
    const schedule = ecs.getComponent(entity, ScheduleComponent);
    const time = ecs.getEntitiesWithComponent(TimeComponent)[0];
    const hour = time ? ecs.getComponent(time, TimeComponent).hour : 0;

    return {
      currentAction: resolveCharacterAction(entity, ecs),
      currentScheduleIndex: hour,
      currentSchedule: convertSchedule(schedule?.entries[hour] ?? AgentActionType.NONE),
      schedule: schedule?.entries.map(convertSchedule) ?? []
    };
  },

  [PanelType.WOOD_DOJO]: (entity, ecs) => {
    const dojo = ecs.getComponent(entity, WoodDojo);
    return {
      assignedAgents: dojo?.assignedAgents ?? []
    };
  },

  [PanelType.CAVE]: (entity, ecs) => ({}),
  [PanelType.TREE]: (entity, ecs) => {
    const harvestable = ecs.getComponent(entity, Harvestable);

    return {
        drops: harvestable?.drops ?? [],
        cutProgress: Math.floor(harvestable?.amount ?? 0),
        maxCutProgress: harvestable?.maxAmount ?? 0,
    }
  }
};
