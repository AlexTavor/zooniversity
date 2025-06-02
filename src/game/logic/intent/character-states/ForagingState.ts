import { Component, Entity } from "../../../ECS";
import { Pos } from "../../../../utils/Math";

export class ForagingState extends Component {
    public targetForagableEntityId: Entity = -1;
    public targetPosition: Pos | undefined; // Exact world position of the reserved slot

    constructor(targetForagableEntityId: Entity = -1, targetPosition: Pos | undefined = undefined) {
        super();
        this.targetForagableEntityId = targetForagableEntityId;
        this.targetPosition = targetPosition;
    }
}