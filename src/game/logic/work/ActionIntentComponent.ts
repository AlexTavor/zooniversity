import { Component } from "../../ECS";

export enum AgentActionType {
    NONE = 0,
    HARVEST = 1,
    BUILD = 2
}

export class ActionIntentComponent extends Component {
  constructor(
    public actionType: AgentActionType,
    public targetEntityId: number,
  ) {
    super();
  }
}
