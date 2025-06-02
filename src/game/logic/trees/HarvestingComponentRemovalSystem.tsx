import { System } from "../../ECS";
import { abortHarvesting } from "../intent/intent-to-action/intent-abort/abortHarvesting";
import { HarvestableComponent } from "./HarvestableComponent";
import { HarvestingState } from "../intent/character-states/HarvestingState";

export class HarvestingComponentRemovalSystem extends System {
    public componentsRequired: Set<Function> = new Set<Function>([HarvestingState]);

    public update(entities: Set<number>, delta: number): void {
        for (const entity of entities) {
            const harvestingComponent = this.ecs.getComponent(entity, HarvestingState);
            const harvestable = this.ecs.getComponent(harvestingComponent.target, HarvestableComponent);
            if (!harvestable || !harvestable.harvestable || harvestable.amount <= 0) {
                abortHarvesting(this.ecs, entity);
            }
        }
    }
}