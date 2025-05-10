// Updated WoodDojoSystem.ts with slot reservation logic

import { System, Entity } from "../../ECS.ts";
import { WoodDojo } from "../components/WoodDojo.ts";
import { Tree } from "../components/Tree.ts";
import { ActionIntentComponent, AgentActionType } from "../work/ActionIntentComponent.ts";
import { CaveTreeLUTComponent } from "../lut/CaveTreeLUTComponent.ts";
import { Harvestable } from "./Harvestable.ts";
import { InteractionSlots } from "./InteractionSlots.ts";

export class WoodDojoSystem extends System {
  componentsRequired = new Set<Function>([WoodDojo]);

  update(entities: Set<Entity>, _: number): void {
    const lutEntity = this.ecs.getEntitiesWithComponent(CaveTreeLUTComponent)[0];
    if (lutEntity === undefined) return;
    const lut = this.ecs.getComponent(lutEntity, CaveTreeLUTComponent).lut;

    for (const dojoEntity of entities) {
      const dojo = this.ecs.getComponent(dojoEntity, WoodDojo);
      const treeIds = lut[dojoEntity];
      if (!treeIds) continue;

      for (const agentId of dojo.assignedAgents) {
        if (!this.ecs.hasEntity(agentId)) continue;

        const intent = this.ecs.getComponent(agentId, ActionIntentComponent);
        if (!intent || intent.actionType !== AgentActionType.HARVEST) continue;

        // If already targeting a tree, validate it
        if (intent.targetEntityId !== -1) {
          const tree = this.ecs.getComponent(intent.targetEntityId, Tree);
          const canHarvest = this.ecs.getComponent(intent.targetEntityId, Harvestable)?.harvestable;
          const treeSelected = tree.selectedForCutting;

          if (!canHarvest || !treeSelected) {
            tree.selectedForCutting = false;
            intent.targetEntityId = -1;
            intent.slotOffset = null;
            return;
          } else {
            continue;
          }
        }

        for (const treeId of treeIds) {
          if (!this.ecs.hasEntity(treeId)) continue;
          const tree = this.ecs.getComponent(treeId, Tree);
          if (!tree.selectedForCutting) continue;

          const slots = this.ecs.getComponent(treeId, InteractionSlots);
          if (!slots) continue;

          const slotOffset = slots.reserve(agentId);
          if (!slotOffset) continue;

          intent.targetEntityId = treeId;
          intent.slotOffset = slotOffset;
          break;
        }
      }
    }
  }
}
