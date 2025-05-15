import {Component} from "../ECS.ts";

export class Transform extends Component {
    locationState: LocationState = LocationState.OUTSIDE;
    direction: number = 0; // -1 for right, 1 for left
    constructor(
        public x: number,
        public y: number
    ) {
        super();
    }
}

export enum LocationState {
    AWAY,
    OUTSIDE,
    INSIDE
}
