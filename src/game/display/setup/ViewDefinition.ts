import {Pos} from "../../../utils/Math.ts";

export class ViewDefinition {
    public readonly id: number;
    public readonly name: string;
    public readonly position: Pos;
    public readonly size: Pos;
    public frame: number;
    public readonly subViews: number[];
}

