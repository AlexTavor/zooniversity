import { ECS, Entity } from "../../../../ECS";
import { HarvestableComponent } from "../../../../logic/trees/HarvestableComponent";

export function treePanelReducer(entity: Entity, ecs: ECS): unknown {
    const harvestable = ecs.getComponent(entity, HarvestableComponent);
    return {
        drops: harvestable?.drops ?? [],
        cutProgress: harvestable ? Math.max(0, Math.floor(harvestable.amount)) : 0,
        maxCutProgress: harvestable?.maxAmount ?? 0,
    };
}
