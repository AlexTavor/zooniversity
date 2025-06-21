import { ECS, Entity } from "../../../ECS";
import { BuffsComponent } from "../../../logic/buffs/BuffsComponent";
import { AffectedStat, BuffEffectApplicationType, BuffEffect, BUFF_DEFINITIONS } from "../../../logic/buffs/buffsData";
import { BuffDisplayRegistry } from "../BuffDisplayRegistry";

export interface DisplayableBuffEffect {
    stat: AffectedStat;
    value: number;
    applicationType: BuffEffectApplicationType;
    effectText: string; // Textual description of the specific effect
}

export interface DisplayableBuffData {
    key: string; 
    displayName: string;
    iconAssetKey: string;
    description: string; // General description of the buff
    effects: DisplayableBuffEffect[];
    totalDurationMinutes: number;
    remainingDurationMinutes: number; 
    isBuff: boolean; 
}

function formatEffectValue(value: number, type: BuffEffectApplicationType): string {
    if (type === BuffEffectApplicationType.FLAT_ADDITIVE) {
        return `${value >= 0 ? '+' : ''}${value}`;
    }
    if (type === BuffEffectApplicationType.PERCENT_MULTIPLICATIVE) {
        const percentage = Math.round((value - 1) * 100);
        return `${percentage >= 0 ? '+' : ''}${percentage}%`;
    }
    return `${value}`; // Fallback
}

function affectedStatToText(stat: AffectedStat): string {
    switch (stat) {
        case AffectedStat.LOCOMOTION_SPEED: return "Speed";
        case AffectedStat.WORK_SPEED: return "Work Rate";
        case AffectedStat.HARVEST_SPEED: return "Harvest Rate";
        default: {
            return "";
        }
    }
}

function effectToText(effect: BuffEffect): string {
    const valueText = formatEffectValue(effect.value, effect.type);
    const statText = affectedStatToText(effect.stat);
    return `${statText}: ${valueText}`;
}

export function deriveBuffs(ecs: ECS, entity: Entity, currentTimeMinutes: number): DisplayableBuffData[] {
    const displayedBuffs: DisplayableBuffData[] = [];
    const activeBuffsComp = ecs.getComponent(entity, BuffsComponent);

    if (!activeBuffsComp || activeBuffsComp.buffs.length === 0) {
        return displayedBuffs;
    }

    for (const activeBuff of activeBuffsComp.buffs) {
        const definition = BUFF_DEFINITIONS[activeBuff.type];
        const displayInfo = BuffDisplayRegistry[activeBuff.type];

        if (definition && displayInfo) {
            const remainingDuration = Math.max(0, Math.floor(activeBuff.expirationTimeMinutes - currentTimeMinutes));
            
            const processedEffects: DisplayableBuffEffect[] = activeBuff.effects.map(eff => ({
                stat: eff.stat,
                value: eff.value,
                applicationType: eff.type,
                effectText: effectToText(eff)
            }));

            displayedBuffs.push({
                key: activeBuff.type.toString(),
                displayName: displayInfo.displayName,
                iconAssetKey: displayInfo.iconAssetKey,
                description: displayInfo.description,
                effects: processedEffects,
                totalDurationMinutes: definition.defaultDurationMinutes,
                remainingDurationMinutes: remainingDuration,
                isBuff: displayInfo.isBuff 
            });
        }
    }
    return displayedBuffs;
}