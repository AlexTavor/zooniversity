import {ViewDefinition} from "../../display/setup/ViewDefinition.ts";

export type MapObjectType = 'tree' | 'rock' | 'cave'; // extend freely

export interface MapObject {
    id: number;
    type: MapObjectType;
    name?: string;
    components?: {
        view?: ViewDefinition;
    };
    zHint?: number; // zHint is used to determine the rendering order of objects
}

export interface MapDefinition {
    name: string;
    hill: ViewDefinition;
    objects: Record<number, MapObject>;
}