import { System, Entity } from "../../../ECS";
import { ActionIntentComponent, AgentActionType } from "../../work/ActionIntentComponent";
import { InteractionSlots, SlotType } from "../../work/InteractionSlots";
import { DormitoryComponent } from "./DormitoryComponent";

export class DormitorySystem extends System {
    componentsRequired = new Set<Function>([DormitoryComponent]);
  
    update(entities: Set<Entity>, _: number): void {
        for (const entity of entities) {
            const slots = this.ecs.getComponent(entity, InteractionSlots);
            if (!slots) continue;
            
            const dorm = this.ecs.getComponent(entity, DormitoryComponent);

            for (const agentId of dorm.assignedAgents) {
                if (!this.ecs.hasEntity(agentId)) continue;

                const intent = this.ecs.getComponent(agentId, ActionIntentComponent);
                if (!intent || intent.actionType !== AgentActionType.SLEEP) continue;

                const slotOffset = slots.reserve(agentId, SlotType.SLEEP);
                if (!slotOffset) continue;

                intent.targetEntityId = entity;
                intent.slotOffset = slotOffset;
            }
        }
    }
}