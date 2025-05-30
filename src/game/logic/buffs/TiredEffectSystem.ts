import { System, Entity, ECS } from "../../ECS";
import { TimeComponent } from "../time/TimeComponent"; // Adjust path
import { NeedsComponent } from "../needs/NeedsComponent";
import { BuffsComponent } from "./BuffsComponent";
import { BuffType } from "./buffsData";

const TIRED_THRESHOLD = 0.65;

export class TiredEffectSystem extends System {
    public componentsRequired = new Set<Function>([NeedsComponent, BuffsComponent]);
    private worldTimeEntity: Entity | null = null;

    private getCurrentTimeMinutes(ecs: ECS): number | null {
        if (this.worldTimeEntity === null || !ecs.hasEntity(this.worldTimeEntity)) {
            const timeEntities = ecs.getEntitiesWithComponent(TimeComponent);
            this.worldTimeEntity = timeEntities.length > 0 ? timeEntities[0] : null;
        }
        if (!this.worldTimeEntity) return null;
        return ecs.getComponent(this.worldTimeEntity, TimeComponent).minutesElapsed;
    }

    public update(entities: Set<Entity>, delta: number): void {
        const currentTimeMinutes = this.getCurrentTimeMinutes(this.ecs);
        if (currentTimeMinutes === null) return;

        for (const entity of entities) {
            const needs = this.ecs.getComponent(entity, NeedsComponent);
            const buffs = this.ecs.getComponent(entity, BuffsComponent);
            if (needs.sleep.current / needs.sleep.max > TIRED_THRESHOLD){
                buffs.removeBuff(BuffType.TIRED);
                return;
            }

            if (!buffs.hasBuff(BuffType.TIRED))
                buffs.addBuff(BuffType.TIRED, 0);
        }
    }
}