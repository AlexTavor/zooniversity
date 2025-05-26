import { System, Entity, ECS } from "../../ECS";
import { TimeConfig } from "../../config/TimeConfig";
import { ActionIntentComponent } from "../action-intent/ActionIntentComponent";
import { CharacterAction } from "../action-intent/actionIntentData";
import { getTime } from "../time/TimeComponent";
import { NeedsComponent } from "./NeedsComponent";

export class SleepNeedSystem extends System {
    public componentsRequired = new Set<Function>([NeedsComponent, ActionIntentComponent]);

    private getDeltaInGameMinutes(ecs: ECS, deltaMs: number): number {
        const time = getTime(ecs);
        if (time.speedFactor === 0) return 0;

        const realSecondsPassed = deltaMs / 1000;
        // Using TimeConfig to correctly scale real seconds to game minutes
        const gameMinutesPassed = (realSecondsPassed / TimeConfig.RealSecondsPerHour) * TimeConfig.MinutesPerHour * time.speedFactor;
        return gameMinutesPassed;
    }

    public update(entities: Set<Entity>, delta: number): void {
        const gameMinutesPassedThisFrame = this.getDeltaInGameMinutes(this.ecs, delta);
        if (gameMinutesPassedThisFrame === 0) return;

        for (const entity of entities) {
            const needs = this.ecs.getComponent(entity, NeedsComponent);
            const actionIntent = this.ecs.getComponent(entity, ActionIntentComponent);

            if (actionIntent.currentPerformedAction === CharacterAction.SLEEPING) {
                needs.sleep.current += needs.sleep.upRatePerMinute * gameMinutesPassedThisFrame;
            } else {
                needs.sleep.current -= needs.sleep.downRatePerMinute * gameMinutesPassedThisFrame;
            }

            needs.sleep.current = Math.max(0, Math.min(needs.sleep.current, needs.sleep.max));
        }
    }
}