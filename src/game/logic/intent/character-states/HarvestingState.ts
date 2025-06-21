import { Pos } from "../../../../utils/Math";
import { Component } from "../../../ECS";

export class HarvestingState extends Component {
    public target: number = -1;
    public targetPos: Pos | undefined;

    constructor(target: number = -1, targetPos: Pos | undefined = undefined) {
        super();
        this.target = target;
        this.targetPos = targetPos;
    }
}
