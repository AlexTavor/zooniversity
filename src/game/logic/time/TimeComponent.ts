import { Component } from "../../ECS";
import { TimeConfig } from "../../config/TimeConfig";

export class TimeComponent extends Component {
    constructor(
        public minutesElapsed: number = 4*TimeConfig.MinutesPerHour,
        public minute: number = 0,
        public hour: number = 4,
        public day: number = 0,
        public semester: number = 0,
        public speedFactor: number = 1
    ) {
        super();
    }
}
