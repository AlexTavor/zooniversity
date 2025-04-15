import {ViewDefinition} from "../../setup/ViewDefinition.ts";

export type MapObjectType = 'tree' | 'rock' | 'cave'; // extend freely

export interface MapObject {
    id: number;
    type: MapObjectType;
    name?: string;
    components?: {
        view?: ViewDefinition;
        [key: string]: any; // future-proofing for additional data
    };
}

export interface MapDefinition {
    name: string;
    hill: ViewDefinition;
    objects: Record<number, MapObject>;
}
