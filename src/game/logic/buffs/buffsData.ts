export enum BuffType {
    RESTED = "RESTED",
    STROLL_SPEED = "STROLL_SPEED"
}

export enum AffectedStat {
    LOCOMOTION_SPEED = "locomotionSpeed",
    WORK_SPEED = "workSpeed",
    HARVEST_SPEED = "harvestSpeed",
}

export enum BuffEffectApplicationType {
    FLAT_ADDITIVE = "FLAT_ADDITIVE",
    PERCENT_MULTIPLICATIVE = "PERCENT_MULTIPLICATIVE",
}

export enum BuffStackingBehavior {
    REFRESH_DURATION = "REFRESH_DURATION", // New instance refreshes duration, effects might update if stronger
    INDEPENDENT_STACKING = "INDEPENDENT_STACKING", // Multiple instances co-exist, StatCalculator sums effects
    NO_STACK = "NO_STACK", // Only one instance allowed; subsequent applications ignored or fail
    HIGHEST_EFFECT_WINS = "HIGHEST_EFFECT_WINS" // Only the instance with the highest effect value for a given stat applies
}

export interface BuffEffect {
    stat: AffectedStat;
    type: BuffEffectApplicationType;
    value: number;
    order?: number; 
}

export interface ActiveBuff {
    type: BuffType;
    expirationTimeMinutes: number;
    effects: BuffEffect[];
    stackingBehavior: BuffStackingBehavior; // Could be copied from BuffDefinition or set per instance
    source?: string;
}

export interface BuffDefinition {
    readonly type: BuffType;
    readonly defaultDurationMinutes: number;
    readonly effects: ReadonlyArray<BuffEffect>;
    readonly stackingBehavior: BuffStackingBehavior;
    readonly displayName?: string; // Optional display name for UI
}

export const MIN_SLEEP_DURATION_FOR_RESTED_BUFF_MINUTES = 90;

export const BUFF_DEFINITIONS: Readonly<Record<BuffType, BuffDefinition>> = {
    [BuffType.RESTED]: {
        type: BuffType.RESTED,
        defaultDurationMinutes: 60,
        effects: [
            { stat: AffectedStat.LOCOMOTION_SPEED, type: BuffEffectApplicationType.PERCENT_MULTIPLICATIVE, value: 1.10, order: 100 },
            { stat: AffectedStat.WORK_SPEED,       type: BuffEffectApplicationType.PERCENT_MULTIPLICATIVE, value: 1.10, order: 100 },
        ],
        stackingBehavior: BuffStackingBehavior.REFRESH_DURATION,
    },
    [BuffType.STROLL_SPEED]: {
        type: BuffType.STROLL_SPEED,
        defaultDurationMinutes: 60 * 24 * 7, // Effectively indefinite, managed by adding/removing
        effects: [
            { stat: AffectedStat.LOCOMOTION_SPEED, type: BuffEffectApplicationType.PERCENT_MULTIPLICATIVE, value: 0.1, order: 50 }
        ],
        stackingBehavior: BuffStackingBehavior.NO_STACK, // Only one instance of this effect
    }
};