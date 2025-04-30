import { Component } from "../../ECS";
import { ResourceType } from "./ResourceType";

export class ResourceComponent extends Component {
    public amounts: Record<ResourceType, number> = {
        [ResourceType.MONEY]: 0,
        [ResourceType.WOOD]: 0,
        [ResourceType.FOOD]: 0,
        [ResourceType.TOOLS]: 0
    };
}
