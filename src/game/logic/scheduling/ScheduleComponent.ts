import { Component } from "../../ECS.ts";
import { AgentActionType } from "../work/ActionIntentComponent.ts";

export type ScheduleEntry = AgentActionType; // One entry per hour

export class ScheduleComponent extends Component {
  constructor(public entries: ScheduleEntry[]) {
    super();
  }
}

export function createStandardSchedule(): ScheduleComponent {
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