import { Component, ECS } from "../../ECS";
import { TimeConfig } from "../../config/TimeConfig";
import { getWorldEntity } from "../serialization/getWorldEntity";

export class TimeComponent extends Component {
    constructor(
        public minutesElapsed: number = 4 * TimeConfig.MinutesPerHour,
        public minute: number = 0,
        public hour: number = 1,
        public day: number = 0,
        public semester: number = 0,
        public speedFactor: number = 1,
    ) {
        super();
    }
}

export function getTime(ecs: ECS): TimeComponent {
    const time = ecs.getComponent(getWorldEntity(ecs), TimeComponent);
    return time!;
}
