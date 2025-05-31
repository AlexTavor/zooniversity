import { ECS, Entity } from "../../ECS"; // Adjust path
import { AffectedStat, BuffEffect, BuffEffectApplicationType } from "./buffsData";
import { LocomotionComponent } from "../locomotion/LocomotionComponent"; // Adjust path
import { HarvesterComponent as HarvesterComponent } from "../trees/HarvesterComponent"; // Adjust path, aliased to avoid name clash
import { BuffsComponent } from "./BuffsComponent";
import { WorkerComponent } from "../characters/WorkerComponent";

export class StatCalculator {

    private static getBaseValue(ecs: ECS, entity: Entity, statType: AffectedStat): number {
        switch (statType) {
            case AffectedStat.LOCOMOTION_SPEED:{
                const loco = ecs.getComponent(entity, LocomotionComponent);
                return loco?.speed ?? 0; // Default to 0 if component or baseSpeed is missing
            }
            case AffectedStat.WORK_SPEED:{
                const worker = ecs.getComponent(entity, WorkerComponent);
                return worker?.workSpeed ?? 0; 
            }
            case AffectedStat.HARVEST_SPEED:{
                const effectiveWorkSpeed = StatCalculator.getEffectiveStat(ecs, entity, AffectedStat.WORK_SPEED);
                const harvesterForHS = ecs.getComponent(entity, HarvesterComponent);
                const baseHarvestSpeedAdditive = harvesterForHS?.harvestPerMinute ?? 0;
                return effectiveWorkSpeed + baseHarvestSpeedAdditive;
            }       
            case AffectedStat.SLEEP_MODIFICATION_RATE:{
                return -0.1;
            }
            case AffectedStat.HUNGER_MODIFICATION_RATE:{
                return -0.25;
            }
            default:
                console.warn(`StatCalculator: Base value for stat type ${statType} not defined.`);
                return 0;
        }
    }

    public static getEffectiveStat(
        ecs: ECS, 
        entity: Entity, 
        statType: AffectedStat
    ): number {
        let currentValue = StatCalculator.getBaseValue(ecs, entity, statType);
        
        const activeBuffsComp = ecs.getComponent(entity, BuffsComponent);
        if (!activeBuffsComp || activeBuffsComp.buffs.length === 0) {
            return currentValue;
        }

        const relevantEffects: BuffEffect[] = [];
        for (const buff of activeBuffsComp.buffs) {
            for (const effect of buff.effects) {
                if (effect.stat === statType) {
                    relevantEffects.push(effect);
                }
            }
        }

        if (relevantEffects.length === 0) {
            return currentValue;
        }

        // Sort effects: FLAT_ADDITIVE first, then PERCENT_MULTIPLICATIVE.
        // Further sort by 'order' if provided.
        relevantEffects.sort((a, b) => {
            const typeOrderA = a.type === BuffEffectApplicationType.FLAT_ADDITIVE ? 1 : 2;
            const typeOrderB = b.type === BuffEffectApplicationType.FLAT_ADDITIVE ? 1 : 2;
            if (typeOrderA !== typeOrderB) {
                return typeOrderA - typeOrderB;
            }
            return (a.order ?? 0) - (b.order ?? 0);
        });

        // Apply flat additive bonuses
        for (const effect of relevantEffects) {
            if (effect.type === BuffEffectApplicationType.FLAT_ADDITIVE) {
                currentValue += effect.value;
            }
        }

        // Apply percent multiplicative bonuses
        for (const effect of relevantEffects) {
            if (effect.type === BuffEffectApplicationType.PERCENT_MULTIPLICATIVE) {
                currentValue *= effect.value; // Assumes value is like 1.1 for +10%
            }
        }
        
        // Min value for stats like speed/rate is typically 0, or a small positive epsilon.
        // This can be handled by the consuming system or configured per stat if needed.
        return currentValue;
    }
}