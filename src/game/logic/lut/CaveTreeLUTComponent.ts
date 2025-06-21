import { Component } from "../../ECS";

export class CaveTreeLUTComponent extends Component {
    constructor(public lut: Record<number, number[]>) {
        super();
    }
}
