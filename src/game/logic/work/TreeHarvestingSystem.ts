import { System, Entity } from "../../ECS.ts";
import { ActionIntentComponent, AgentActionType } from "./ActionIntentComponent.ts";
import { Transform } from "../components/Transform.ts";
import { Tree } from "../components/Tree.ts";
import { LocomotionComponent } from "../locomotion/LocomotionComponent.ts";
import { Harvestable, HarvestableType } from "./Harvestable.ts";
import { Harvester } from "./Harvester.ts";
import { TimeComponent } from "../time/TimeComponent.ts";

export class TreeHarvestingSystem extends System {
  componentsRequired = new Set<Function>([
    ActionIntentComponent,
    Harvester,
    LocomotionComponent,
    Transform
  ]);

  update(entities: Set<Entity>, delta: number): void {
    for (const entity of entities) {
      const intent = this.ecs.getComponent(entity, ActionIntentComponent);
      if (intent.actionType !== AgentActionType.HARVEST) continue;

      const locomotion = this.ecs.getComponent(entity, LocomotionComponent);
      if (!locomotion.arrived) continue;

      const targetId = intent.targetEntityId;
      if (!this.ecs.hasEntity(targetId)) continue;

      const harvestable = this.ecs.getComponent(targetId, Harvestable);
      const tree = this.ecs.getComponent(targetId, Tree);

      if (!harvestable || !tree) {
        return;
    }

      if (
        harvestable.type !== HarvestableType.TREE ||
        !harvestable.harvestable ||
        harvestable.harvested ||
        !tree.selectedForCutting
      ) {
        continue;
      }

      const worldEntity = this.ecs.getEntitiesWithComponent(TimeComponent)[0];
      const time = this.ecs.getComponent(worldEntity, TimeComponent);
      const scaledDelta = delta * time.speedFactor;
  
      const harvester = this.ecs.getComponent(entity, Harvester);
      const harvestPerFrame = harvester.harvestPerMinute * (scaledDelta / 60);

      harvestable.amount -= harvestPerFrame;
      if (harvestable.amount <= 0) {
        this.handleHarvestReady(harvestable, intent);
      }
    }
  }

    private handleHarvestReady(harvestable: Harvestable, intent: ActionIntentComponent) {
        harvestable.amount = 0;
        harvestable.harvested = true;
        harvestable.harvestable = false;
    }
}
