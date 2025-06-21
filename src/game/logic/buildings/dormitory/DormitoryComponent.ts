import { Component } from "../../../ECS";

export class DormitoryComponent extends Component {
    public assignedCharacters: number[] = [];

    constructor(public maxCapacity: number = 5) {
        super();
    }
}
