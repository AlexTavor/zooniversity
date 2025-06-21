import { System, Entity } from "../../ECS";
import { ForagableComponent } from "./ForagableComponent";
import { getDeltaInGameMinutes } from "../../display/utils/getDeltaInGameMinutes";
import { ForageRegenComponent } from "./ForageRegenComponent";

export class ForageRegenerationSystem extends System {
    public componentsRequired = new Set<Function>([ForagableComponent]);

    public update(entities: Set<Entity>, deltaMs: number): void {
        const gameMinutesPassedThisFrame = getDeltaInGameMinutes(
            this.ecs,
            deltaMs,
        );
        if (gameMinutesPassedThisFrame === 0) return;

        for (const entity of entities) {
            const foragable = this.ecs.getComponent(entity, ForagableComponent);

            if (foragable.currentAmount < foragable.maxAmount) {
                const regen = this.ecs.getComponent(
                    entity,
                    ForageRegenComponent,
                );
                if (!regen) {
                    this.ecs.addComponent(entity, new ForageRegenComponent());
                }
                const amountToRegen =
                    foragable.regenRatePerMinute * gameMinutesPassedThisFrame;
                foragable.currentAmount += amountToRegen;
                if (foragable.currentAmount >= foragable.maxAmount) {
                    foragable.currentAmount = foragable.maxAmount;
                    this.ecs.removeComponent(entity, ForageRegenComponent);
                }
            }
        }
    }
}
