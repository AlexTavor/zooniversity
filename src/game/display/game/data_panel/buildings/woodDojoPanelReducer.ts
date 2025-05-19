import { ECS, Entity } from "../../../../ECS";
import { WoodDojo } from "../../../../logic/buildings/wood_dojo/WoodDojo";

export function woodDojoPanelReducer(entity: Entity, ecs: ECS): unknown {
    const dojo = ecs.getComponent(entity, WoodDojo);
    return { assignedCharacters: dojo?.assignedCharacters ?? [] };
}
