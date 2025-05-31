import { System, Entity, ECS } from "../../ECS";
import { getDeltaInGameMinutes } from "../../display/utils/getDeltaInGameMinutes";
import { StatCalculator } from "../buffs/StatCalculator";
import { AffectedStat } from "../buffs/buffsData";
import { NeedType, NeedsComponent } from "./NeedsComponent";

export class SleepNeedSystem extends System {
    public componentsRequired = new Set<Function>([NeedsComponent]);


    public update(entities: Set<Entity>, delta: number): void {
        const gameMinutesPassedThisFrame = getDeltaInGameMinutes(this.ecs, delta);
        if (gameMinutesPassedThisFrame === 0) return;

        for (const entity of entities) {
            const needs = this.ecs.getComponent(entity, NeedsComponent);
            const sleep = needs.need(NeedType.SLEEP);
            if (!sleep){
                // This char doesn't need to sleep
                return;
            }
            const sleepModificationRate = StatCalculator.getEffectiveStat(this.ecs, entity, AffectedStat.SLEEP_MODIFICATION_RATE);
            const newCurrent = Math.max(0, Math.min(sleep.current + sleepModificationRate * gameMinutesPassedThisFrame, sleep.max));
            needs.updateNeedCurrent(NeedType.SLEEP, newCurrent);
        }
    }
}