import { Entity, ECS } from "../../../ECS"; // Adjust path
import { WoodDojo } from "../../../logic/buildings/wood_dojo/WoodDojo"; // Adjust path
import { ScheduleComponent } from "../../../logic/scheduling/ScheduleComponent"; // Adjust path
import { TimeComponent } from "../../../logic/time/TimeComponent"; // Adjust path
import { HarvestableComponent } from "../../../logic/work/HarvestableComponent"; // Adjust path
import { PanelType } from "../../setup/ViewDefinition";

// Import new enums and component
import { ActionIntentComponent } from "../../../logic/action-intent/ActionIntentComponent"; // New
import { CharacterIntent, CharacterAction } from "../../../logic/action-intent/actionIntentData"; // New

export type PanelTypeReducer = (entity: Entity, ecs: ECS) => unknown;

// This enum is for UI display purposes for the schedule.
export enum CharacterScheduleDisplayType {
  HARVEST = "Harvest",
  SLEEP = "Sleep",
  STUDY = "Study",
  REST = "Rest",
  BUILD = "Build",
  NONE = "None",
}

/** Converts a CharacterIntent from the schedule into a display-friendly string/type. */
function convertScheduleIntentToDisplay(intent: CharacterIntent): CharacterScheduleDisplayType {
  switch (intent) {
    case CharacterIntent.HARVEST: return CharacterScheduleDisplayType.HARVEST;
    case CharacterIntent.SLEEP: return CharacterScheduleDisplayType.SLEEP;
    case CharacterIntent.STUDY: return CharacterScheduleDisplayType.STUDY;
    case CharacterIntent.REST: return CharacterScheduleDisplayType.REST;
    case CharacterIntent.BUILD: return CharacterScheduleDisplayType.BUILD;
    case CharacterIntent.NONE: return CharacterScheduleDisplayType.NONE;
    default:
      // Log unhandled intent if necessary, or return a default
      // const _exhaustiveCheck: never = intent; // For exhaustive checks at compile time
      return CharacterScheduleDisplayType.NONE;
  }
}

export const PanelTypeReducers: Partial<Record<PanelType, PanelTypeReducer>> = {
  [PanelType.CHARACTER]: (entity, ecs) => {
    const actionIntent = ecs.getComponent(entity, ActionIntentComponent);
    const schedule = ecs.getComponent(entity, ScheduleComponent);
    const timeEntity = ecs.getEntitiesWithComponent(TimeComponent)[0];
    const hour = timeEntity ? ecs.getComponent(timeEntity, TimeComponent).hour : 0;

    const currentScheduleIntent = schedule?.entries[hour] ?? CharacterIntent.NONE;

    return {
      // currentAction is now directly read from the new ActionIntentComponent
      currentAction: actionIntent?.currentPerformedAction ?? CharacterAction.IDLE,
      currentScheduleIndex: hour,
      // currentSchedule now reflects the display type of the *intent* for that hour
      currentSchedule: convertScheduleIntentToDisplay(currentScheduleIntent),
      // schedule also maps intents to display types
      schedule: schedule?.entries.map(convertScheduleIntentToDisplay) ?? []
    };
  },

  [PanelType.WOOD_DOJO]: (entity, ecs) => {
    const dojo = ecs.getComponent(entity, WoodDojo);
    return {
      assignedAgents: dojo?.assignedAgents ?? []
    };
  },

  [PanelType.CAVE]: (entity, ecs) => ({
    // Keep existing CAVE panel logic if any, or default to empty
  }),

  [PanelType.TREE]: (entity, ecs) => {
    const harvestable = ecs.getComponent(entity, HarvestableComponent);
    return {
        drops: harvestable?.drops ?? [],
        // Assuming cutProgress and maxCutProgress are still relevant from Harvestable
        cutProgress: harvestable ? Math.max(0, Math.floor(harvestable.amount)) : 0,
        maxCutProgress: harvestable?.maxAmount ?? 0,
    };
  }
};