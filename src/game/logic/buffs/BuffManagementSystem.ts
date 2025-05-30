import { System, Entity } from "../../ECS";
import { TimeComponent } from "../time/TimeComponent";
import { BuffsComponent } from "./BuffsComponent";

export class BuffManagementSystem extends System {
    public componentsRequired = new Set<Function>([BuffsComponent]);
    private worldTimeEntity: Entity | null = null;

    private getCurrentTimeMinutes(): number | null {
        if (this.worldTimeEntity === null || !this.ecs.hasEntity(this.worldTimeEntity)) {
            const timeEntities = this.ecs.getEntitiesWithComponent(TimeComponent);
            if (timeEntities.length > 0) {
                this.worldTimeEntity = timeEntities[0];
            } else {
                return null; 
            }
        }
        return this.ecs.getComponent(this.worldTimeEntity, TimeComponent).minutesElapsed;
    }

    public update(entities: Set<Entity>, delta: number): void {
        const currentTimeMinutes = this.getCurrentTimeMinutes();
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