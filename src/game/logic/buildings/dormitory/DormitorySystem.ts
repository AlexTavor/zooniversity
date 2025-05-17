import { System, Entity } from "../../../ECS";
import { DormitoryComponent } from "./DormitoryComponent";

export class DormitorySystem extends System {
    public componentsRequired = new Set<Function>([DormitoryComponent]);

    public update(dormitoryEntities: Set<Entity>, delta: number): void {
        for (const dormitoryEntity of dormitoryEntities) {
            const dorm = this.ecs.getComponent(dormitoryEntity, DormitoryComponent);

            for (let i = dorm.assignedAgents.length - 1; i >= 0; i--) {
                const agentId = dorm.assignedAgents[i];
                if (!this.ecs.hasEntity(agentId)) {
                    dorm.assignedAgents.splice(i, 1);
                }
            }
        }
    }
}