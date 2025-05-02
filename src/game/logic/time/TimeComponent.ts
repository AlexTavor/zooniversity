import { Component } from "../../ECS";

export class TimeComponent extends Component {
    constructor(
        public minutesElapsed: number = 4*60,
        public minute: number = 0,
        public hour: number = 4,
        public day: number = 0,
        public semester: number = 0,
        public speedFactor: number = 1
    ) {
        super();
    }
}
