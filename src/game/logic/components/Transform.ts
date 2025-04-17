import {Component} from "../../ECS.ts";

export class Transform extends Component {
    constructor(
        public x: number,
        public y: number,
        public z: number = 0 // Optional for layering
    ) {
        super();
    }
}