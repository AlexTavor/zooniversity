import { System, Entity } from "../../ECS";
import { getTime } from "../time/TimeComponent";
import { BuffsComponent } from "./BuffsComponent";

export class BuffManagementSystem extends System {
    public componentsRequired = new Set<Function>([BuffsComponent]);

    public update(entities: Set<Entity>, delta: number): void {
        const currentTimeMinutes = getTime(this.ecs).minutesElapsed;
        if (currentTimeMinutes === null) {
            return; 
        }

        for (const entity of entities) {
            const activeBuffs = this.ecs.getComponent(entity, BuffsComponent);
            
            activeBuffs.buffs = activeBuffs.buffs.filter(
                buff => buff.expirationTimeMinutes > currentTimeMinutes
            );
        }
    }
}