import { Component } from "../../ECS";

export class StoryEventStateComponent extends Component {
    constructor(
        public eventId: string,
        public currentPageId: string
    ) {
        super();
    }
}
