import { System, Entity } from "../../../ECS";
import { WoodDojo } from "./WoodDojo";

export class WoodDojoSystem extends System {
    public componentsRequired = new Set<Function>([WoodDojo]);

    public update(dojoEntities: Set<Entity>, delta: number): void {
        for (const dojoEntity of dojoEntities) {
            const dojo = this.ecs.getComponent(dojoEntity, WoodDojo);

            // Clean up non-existent characters from the assignedAgents list
            // Iterate backwards when removing elements from an array during iteration
            for (let i = dojo.assignedAgents.length - 1; i >= 0; i--) {
                const agentId = dojo.assignedAgents[i];
                if (!this.ecs.hasEntity(agentId)) {
                    dojo.assignedAgents.splice(i, 1);
                }
            }
        }
    }
}