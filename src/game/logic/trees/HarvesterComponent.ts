import { Component } from "../../ECS";

export class HarvesterComponent extends Component {
    public harvestPerMinute: number = 5;

    constructor() {
        super();
    }
}
