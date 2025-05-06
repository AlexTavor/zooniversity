import {Component} from "../../ECS.ts";

export class Transform extends Component {
    direction: number = 1; // -1 for right, 1 for left
    constructor(
        public x: number,
        public y: number
    ) {
        super();
    }
}