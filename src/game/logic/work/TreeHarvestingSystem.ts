import { System, Entity } from "../../ECS.ts";
import { ActionIntentComponent, AgentActionType } from "./ActionIntentComponent.ts";
import { Transform } from "../components/Transform.ts";
import { Tree } from "../components/Tree.ts";
import { LocomotionComponent } from "../locomotion/LocomotionComponent.ts";
import { Harvestable } from "./Harvestable.ts";
import { Harvester } from "./Harvester.ts";
import { TimeComponent } from "../time/TimeComponent.ts";
import { ResourceComponent } from "../resources/ResourceComponent.ts";
import { InteractionSlots } from "./InteractionSlots.ts";

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
        this.cleanIntent(targetId, entity, intent);
        continue;
      }

      const shouldAbort =
        !harvestable.harvestable ||
        harvestable.harvested ||
        !tree.selectedForCutting;

      if (shouldAbort) {
        if (tree.isBeingCut) {
          tree.isBeingCut = false;
          this.cleanIntent(targetId, entity, intent);
        }
        continue;
      }

      tree.isBeingCut = true;

      const worldEntity = this.ecs.getEntitiesWithComponent(TimeComponent)[0];
      const time = this.ecs.getComponent(worldEntity, TimeComponent);
      const scaledDelta = delta * time.speedFactor;

      const harvester = this.ecs.getComponent(entity, Harvester);
      const harvestPerFrame = harvester.harvestPerMinute * (scaledDelta / 60);

      harvestable.amount -= harvestPerFrame;
      if (harvestable.amount <= 0) {
        this.handleHarvestReady(harvestable);
        this.collectHarvestedResources(harvestable);
        this.cleanIntent(targetId, entity, intent);
      }
    }
  }

  private cleanIntent(targetId: number, entity: number, intent: ActionIntentComponent) {
    this.releaseSlot(targetId, entity);
    // intent.targetEntityId = -1;
    intent.slotOffset = null;
  }

  private collectHarvestedResources(harvestable: Harvestable) {
    const resourcesEntity = this.ecs.getEntitiesWithComponent(ResourceComponent)[0];
    const resources = this.ecs.getComponent(resourcesEntity, ResourceComponent);
    if (resources) {
      harvestable.drops.forEach((drop) => {
        resources.amounts[drop.type] += drop.amount;
      });
    }
  }

  private handleHarvestReady(harvestable: Harvestable) {
    harvestable.amount = 0;
    harvestable.harvested = true;
    harvestable.harvestable = false;
  }

  private releaseSlot(targetId: Entity, agentId: Entity) {
    const slots = this.ecs.getComponent(targetId, InteractionSlots);
    if (slots) {
      (slots as InteractionSlots).release(agentId);
    }
  }
}
