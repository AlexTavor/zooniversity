import { Component, ECS } from "../../ECS";
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

let worldEntity:number;
let hasWorlEntity:boolean;

export function getCurrentHour(ecs: ECS): number {
    if (!hasWorlEntity){
        worldEntity = ecs.getEntitiesWithComponent(TimeComponent)[0];
        hasWorlEntity = true;
    }
    const time = ecs.getComponent(worldEntity, TimeComponent);
    return time?.hour || 0;
}

export function getTime(ecs: ECS): TimeComponent {
    if (!hasWorlEntity){
        worldEntity = ecs.getEntitiesWithComponent(TimeComponent)[0];
        hasWorlEntity = true;
    }
    const time = ecs.getComponent(worldEntity, TimeComponent);
    return time!;
}
