import { Component } from "../../ECS";

export class NeedsComponent extends Component {
    public sleep = { current: 100, max: 100, downRatePerMinute: 0.5, upRatePerMinute: 1 };
}