import { Component } from "../../ECS";

export class TimeComponent extends Component {
    constructor(
        public minutesElapsed: number = 0,
        public minute: number = 0,
        public hour: number = 0,
        public day: number = 0,
        public semester: number = 0,
        public speedFactor: number = 1
    ) {
        super();
    }
}
