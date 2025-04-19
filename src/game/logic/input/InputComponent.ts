import { Component } from "../../ECS";

export type TimeSpeed = 'paused' | 'normal' | 'fast' | 'veryfast';

export class InputComponent extends Component {
    constructor(public speed: TimeSpeed = 'normal') {
        super();
    }
}
