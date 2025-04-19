import {Pos} from "../../../utils/Math.ts";

export enum ViewType {
    NONE = 0,
    TREE = 1,
    CAVE = 2,
    CLOUD = 3,
    HILL = 4,
}

export class ViewDefinition {
    public readonly id: number;
    public readonly spriteName: string;
    public readonly position: Pos;
    public readonly size: Pos;
    public frame: number;
    public subViews: number[];
    public type = ViewType.NONE;
}

