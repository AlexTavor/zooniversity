import { Component } from "../../ECS";

export enum AgentActionType {
    NONE = 0,
    HARVEST = 1,
    BUILD = 2,
    SLEEP = 3,
    REST = 4,
    STUDY = 5,
}

export class ActionIntentComponent extends Component {
  private _actionType: AgentActionType = AgentActionType.NONE;

  ranges: Record<AgentActionType, number> = {
    [AgentActionType.NONE]: 0,
    [AgentActionType.HARVEST]: 100,
    [AgentActionType.BUILD]: 100,
    [AgentActionType.SLEEP]: 0,
    [AgentActionType.REST]: 0,
    [AgentActionType.STUDY]: 0,
  };

  slotOffset: { x: number; y: number; } | null = null;
  range: number = 0;
  targetEntityId: number = -1;

  get actionType(): AgentActionType {
    return this._actionType;
  }

  set actionType(v: AgentActionType) {
    this._actionType = v;
    this.range = this.ranges[v] || 0;
    this.slotOffset = null;
    this.targetEntityId = -1;
  }
}
