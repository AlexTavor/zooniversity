import { Component } from "../../../ECS";

export class DormitoryComponent extends Component {
    public assignedAgents: number[] = [];

    constructor(public maxCapacity: number = 5) {
        super();
    }
}