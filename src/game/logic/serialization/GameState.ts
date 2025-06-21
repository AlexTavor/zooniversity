// All components should be serializable to JSON.
import { Entity } from "../../ECS.ts";

export interface GameState {
    entities: EntityState[];
}

export interface EntityState {
    id: Entity;
    components: Record<string, any>; // key = component class name, value = serialized data
}
