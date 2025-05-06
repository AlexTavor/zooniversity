import { System, Entity } from "../../ECS.ts";
import { WoodDojo } from "../components/WoodDojo.ts";
import { Tree } from "../components/Tree.ts";
import { ActionIntentComponent, AgentActionType } from "../work/ActionIntentComponent.ts";
import { CaveTreeLUTComponent } from "../lut/CaveTreeLUTComponent.ts";
import { Harvestable } from "./Harvestable.ts";

export class WoodDojoSystem extends System {
  componentsRequired = new Set<Function>([WoodDojo]);

  update(entities: Set<Entity>, _: number): void {
    // Get the LUT singleton entity
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
        if (
          !intent ||
          intent.actionType !== AgentActionType.HARVEST
        ) continue;

        // Check if the agent has a target entity and the target entity is harvestable
        if (intent.targetEntityId != -1){
            const tree = this.ecs.getComponent(intent.targetEntityId, Tree);
            const canHarvest = this.ecs.getComponent(intent.targetEntityId, Harvestable)?.harvestable;
            const treeSelected = tree.selectedForCutting;

            if (canHarvest === false || treeSelected === false) {
                tree.selectedForCutting = false;
                intent.targetEntityId = -1;
            }

            continue
        }

        for (const treeId of treeIds) {
          if (!this.ecs.hasEntity(treeId)) continue;
          if (!this.ecs.getComponent(treeId, Tree).selectedForCutting) continue;

          intent.targetEntityId = treeId;

          break;
        }
      }
    }
  }
}
