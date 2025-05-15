import { Component } from "../../ECS";

export class Harvester extends Component {
    public harvestPerMinute: number = 5;

    constructor() {
        super();
    }
}