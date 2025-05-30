import { Component } from "../../ECS";

export class NeedsComponent extends Component {
    public sleep = { current: 75, max: 100};
}