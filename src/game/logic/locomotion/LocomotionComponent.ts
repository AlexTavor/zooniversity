import { Component } from "../../ECS.ts";
import { Pos } from "../../../utils/Math.ts";

export class LocomotionComponent extends Component {
    public destination: Pos;
    public speed: number = 1;
    public arrived: boolean = false;

    constructor() {
        super();
    }
}
