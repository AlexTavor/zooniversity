import { Entity, System } from "../../ECS";
import { ActionIntentComponent } from "./intent-to-action/ActionIntentComponent";
import {
    CharacterIntent,
    CharacterAction,
} from "./intent-to-action/actionIntentData";
import { ScheduleComponent } from "../characters/ScheduleComponent";
import { getTime } from "../time/TimeComponent";
import { NeedsComponent } from "../needs/NeedsComponent";
import { calculateHarvestIntentWeight } from "./weights/calculateHarvestIntentWeight";
import { calculateSleepIntentWeight } from "./weights/calculateSleepIntentWeight";
import { calculateRestIntentWeight } from "./weights/calculateRestIntentWeight";
import { calculateEatIntentWeight } from "./weights/calculateEatIntentWeight";
import { calculateForagetIntentWeight } from "./weights/calculateForagetIntentWeight";

export class IntentSelectionSystem extends System {
    public componentsRequired = new Set<Function>([
        ActionIntentComponent,
        ScheduleComponent,
        NeedsComponent,
    ]);

    public update(entities: Set<Entity>, _delta: number): void {
        const currentHour = getTime(this.ecs).hour;

        for (const entity of entities) {
            const actionIntent = this.ecs.getComponent(
                entity,
                ActionIntentComponent,
            );
            const schedule = this.ecs.getComponent(entity, ScheduleComponent);
            const needs = this.ecs.getComponent(entity, NeedsComponent);

            const intentWeights: { intent: CharacterIntent; weight: number }[] =
                [];

            // Calculate weights for all relevant intents
            intentWeights.push({
                intent: CharacterIntent.SLEEP,
                weight: calculateSleepIntentWeight(
                    this.ecs,
                    entity,
                    actionIntent,
                    schedule,
                    needs,
                    currentHour,
                ),
            });
            intentWeights.push({
                intent: CharacterIntent.EAT,
                weight: calculateEatIntentWeight(
                    this.ecs,
                    entity,
                    actionIntent,
                    schedule,
                    needs,
                    currentHour,
                ),
            });
            intentWeights.push({
                intent: CharacterIntent.HARVEST,
                weight: calculateHarvestIntentWeight(
                    this.ecs,
                    entity,
                    schedule,
                    needs,
                    currentHour,
                ),
            });
            intentWeights.push({
                intent: CharacterIntent.REST,
                weight: calculateRestIntentWeight(
                    this.ecs,
                    entity,
                    schedule,
                    needs,
                    currentHour,
                ),
            });
            intentWeights.push({
                intent: CharacterIntent.FORAGE,
                weight: calculateForagetIntentWeight(
                    this.ecs,
                    entity,
                    schedule,
                    needs,
                    currentHour,
                ),
            });

            // Sort by weight descending
            intentWeights.sort((a, b) => b.weight - a.weight);

            let chosenIntent = CharacterIntent.REST;

            if (intentWeights.length > 0 && intentWeights[0].weight > 0) {
                chosenIntent = intentWeights[0].intent;
            }

            if (actionIntent.intentType !== chosenIntent) {
                actionIntent.intentType = chosenIntent;
                actionIntent.currentPerformedAction = CharacterAction.IDLE; // Reset action
                actionIntent.actionData = null; // Clear data for the new intent
            }
        }
    }
}
