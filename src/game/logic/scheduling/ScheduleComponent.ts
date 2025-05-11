import { Component } from "../../ECS.ts";
import { AgentActionType } from "../work/ActionIntentComponent.ts";

export type ScheduleEntry = AgentActionType; // One entry per hour

export class ScheduleComponent extends Component {
  constructor(public entries: ScheduleEntry[]) {
    super();
  }
}

export function createStandardSchedule(): ScheduleComponent {
  // 8-hour schedule: [SLEEP, SLEEP, HARVEST, HARVEST, HARVEST, HARVEST, REST, SLEEP]
  return new ScheduleComponent([
    AgentActionType.SLEEP,
    AgentActionType.HARVEST,
    AgentActionType.HARVEST,
    AgentActionType.REST,
    AgentActionType.HARVEST,
    AgentActionType.HARVEST,
    AgentActionType.HARVEST,
    AgentActionType.SLEEP
  ]);
}