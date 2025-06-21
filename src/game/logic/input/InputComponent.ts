import { Component } from "../../ECS";

export type TimeSpeed = "paused" | "normal" | "fast" | "veryfast";

export class InputComponent extends Component {
    constructor(
        public speed: TimeSpeed = "normal",
        public selection: number = -1, // -1 means no selection
    ) {
        super();
    }
}
