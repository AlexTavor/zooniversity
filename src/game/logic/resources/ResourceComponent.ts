import { Component } from "../../ECS";
import { ResourceType } from "./ResourceType";

export class ResourceComponent extends Component {
    public amounts: Record<ResourceType, number> = {
        [ResourceType.MONEY]: 10,
        [ResourceType.WOOD]: 0,
        [ResourceType.FOOD]: 100,
        [ResourceType.TOOLS]: 0
    };
}
