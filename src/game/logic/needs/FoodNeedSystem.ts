import { System, Entity } from "../../ECS";
import { getDeltaInGameMinutes } from "../../display/utils/getDeltaInGameMinutes";
import { StatCalculator } from "../buffs/StatCalculator";
import { AffectedStat } from "../buffs/buffsData";
import { NeedType, NeedsComponent } from "./NeedsComponent";

export class FoodNeedSystem extends System {
    public componentsRequired = new Set<Function>([NeedsComponent]);

    public update(entities: Set<Entity>, delta: number): void {
        const gameMinutesPassedThisFrame = getDeltaInGameMinutes(
            this.ecs,
            delta,
        );
        if (gameMinutesPassedThisFrame === 0) return;

        for (const entity of entities) {
            const needsComponent = this.ecs.getComponent(
                entity,
                NeedsComponent,
            );
            if (!needsComponent) continue;

            const foodNeed = needsComponent.need(NeedType.FOOD);
            if (!foodNeed) {
                // This char doesn't need to eat
                continue;
            }

            const foodModificationRate = StatCalculator.getEffectiveStat(
                this.ecs,
                entity,
                AffectedStat.HUNGER_MODIFICATION_RATE,
            );

            const newCurrent =
                foodNeed.current +
                foodModificationRate * gameMinutesPassedThisFrame;

            needsComponent.updateNeedCurrent(NeedType.FOOD, newCurrent);
        }
    }
}
