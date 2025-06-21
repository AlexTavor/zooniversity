import { System, Entity } from "../../ECS";
import { NeedType, NeedsComponent } from "../needs/NeedsComponent";
import { getTime } from "../time/TimeComponent";
import { BuffsComponent } from "./BuffsComponent";
import { BuffType } from "./buffsData";

const TIRED_THRESHOLD = 0.65;

export class TiredEffectSystem extends System {
    public componentsRequired = new Set<Function>([
        NeedsComponent,
        BuffsComponent,
    ]);

    public update(entities: Set<Entity>, _delta: number): void {
        const currentTimeMinutes = getTime(this.ecs).minutesElapsed;
        if (currentTimeMinutes === null) return;

        for (const entity of entities) {
            const needs = this.ecs.getComponent(entity, NeedsComponent);
            const sleep = needs.need(NeedType.SLEEP);
            if (!sleep) {
                continue;
            }
            const buffs = this.ecs.getComponent(entity, BuffsComponent);
            if (sleep.current / sleep.max > TIRED_THRESHOLD) {
                buffs.removeBuff(BuffType.TIRED);
                return;
            }

            if (!buffs.hasBuff(BuffType.TIRED))
                buffs.addBuff(BuffType.TIRED, 0);
        }
    }
}
