import {Pos} from "../../../utils/Math.ts";

export enum ViewType {
    NONE = 0,
    TREE = 1,
    CAVE = 2,
    CHARCTER = 3,
    ICON = 4,
}

export enum DisplayTraitType {
    NONE = 0,
    WOOD = 1,
    FOOD = 2
}

export class DisplayTrait {
    public type: DisplayTraitType;
    public value: number;
}

export class PanelDefinition {
    public title:string;
    public description:string;
    public imagePath:string;
    public traits?: DisplayTrait[];
    public entity: number;
    actions?: PanelActionDefinition[];
}

export interface PanelActionDefinition {
    label: string;
    type: string;
}

export class ViewDefinition {
    public readonly id: number;
    public readonly spriteName: string;
    public readonly position: Pos;
    public readonly size: Pos;
    public frame: number;
    public subViews: number[];
    public type = ViewType.NONE;
    public selectable = true;
    public panelDefinition?: PanelDefinition;
}

