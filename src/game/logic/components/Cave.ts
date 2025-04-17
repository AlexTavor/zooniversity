import {Component} from "../../ECS.ts";

export class Cave extends Component {
    constructor(
        public explored: boolean = false
    ) {
        super();
    }
}