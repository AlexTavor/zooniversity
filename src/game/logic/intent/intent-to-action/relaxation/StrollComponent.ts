import { Pos } from "../../../../../utils/Math";
import { Component, Entity } from "../../../../ECS";

export class StrollComponent extends Component {
    public referencePointEntityId: Entity;
    public currentPathTargetPos?: Pos;
    public currentTargetTreeId?: Entity;
    public lastTargetTreeId?: Entity;
    public isPausedAtTarget: boolean = false;
    public pauseUntilTime: number = 0;

    constructor(
        referencePointEntityId: Entity,
        initialTargetTreeId?: Entity,
        initialPathTargetPos?: Pos,
    ) {
        super();
        this.referencePointEntityId = referencePointEntityId;
        this.currentTargetTreeId = initialTargetTreeId;
        this.currentPathTargetPos = initialPathTargetPos;
    }
}
