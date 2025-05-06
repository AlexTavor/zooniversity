import { Component } from "../../ECS";

export class Harvester extends Component {
    public range: number = 100;
    public harvestPerMinute: number = 5;

    constructor() {
        super();
    }
}