// src/game/logic/character-states/SleepingComponent.ts
import { Component, Entity } from "../../../ECS";
import { Pos } from "../../../../utils/Math";

export class SleepingState extends Component {
    public targetBedEntityId: Entity = -1;
    public targetPosition: Pos | undefined;

    constructor(
        targetBedEntityId: Entity = -1,
        targetPosition: Pos | undefined = undefined,
    ) {
        super();
        this.targetBedEntityId = targetBedEntityId;
        this.targetPosition = targetPosition;
    }
}
