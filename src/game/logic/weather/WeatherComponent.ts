import { Component } from "../../ECS.ts";

export class WeatherComponent extends Component {
    constructor(
        public windDirection: 1 | -1 = 1,
        public windStrength: number = 0.5,
        public cloudCover: number = 0.5,
    ) {
        super();
    }
}
