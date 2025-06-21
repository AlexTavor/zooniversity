import { ResourceType } from "./ResourceType";

export interface ResourceDefinition {
    icon: string; // Path to icon
    description: string; // Human-friendly tooltip or label
}

export const ResourceConfig: Record<ResourceType, ResourceDefinition> = {
    [ResourceType.MONEY]: {
        icon: "assets/icons/money_icon.png",
        description: "Money",
    },
    [ResourceType.WOOD]: {
        icon: "assets/icons/wood_icon.png",
        description: "Wood",
    },
    [ResourceType.FOOD]: {
        icon: "assets/icons/food_icon.png",
        description: "Food",
    },
    [ResourceType.TOOLS]: {
        icon: "assets/icons/tools_icon.png",
        description: "Tools",
    },
};
