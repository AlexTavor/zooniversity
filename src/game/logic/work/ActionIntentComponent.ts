import { Component } from "../../ECS";

export enum AgentActionType {
    NONE = 0,
    HARVEST = 1,
    BUILD = 2
}

export class ActionIntentComponent extends Component {
  slotOffset: { x: number; y: number; } | null = null;
  constructor(
    public actionType: AgentActionType,
    public targetEntityId: number,
  ) {
    super();
  }
}
