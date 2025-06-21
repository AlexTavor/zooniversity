import { Component } from "../../ECS";

export class ForagerComponent extends Component {
    public foragePerMinute: number = 1;

    constructor() {
        super();
    }
}
