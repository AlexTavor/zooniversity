import { Component } from "../../ECS";
import { ActiveBuff, BuffType, BUFF_DEFINITIONS, BuffStackingBehavior } from "./buffsData";

export class BuffsComponent extends Component {
    public buffs: ActiveBuff[] = [];

    public addBuff(buffTypeToAdd: BuffType, currentTimeMinutes: number): void {
        const definition = BUFF_DEFINITIONS[buffTypeToAdd];
        if (!definition) {
            console.warn(`Attempted to add undefined buff type: ${buffTypeToAdd}`);
            return;
        }

        const newExpirationTimeMinutes = currentTimeMinutes + definition.defaultDurationMinutes;
        const existingBuffIndex = this.buffs.findIndex(b => b.type == buffTypeToAdd);

        if (existingBuffIndex != -1) {
            const existingBuff = this.buffs[existingBuffIndex];
            switch (definition.stackingBehavior) {
                case BuffStackingBehavior.REFRESH_DURATION:
                    existingBuff.expirationTimeMinutes = Math.max(existingBuff.expirationTimeMinutes, newExpirationTimeMinutes);
                    // Optionally, if effects could change or be stronger, update them:
                    // existingBuff.effects = [...definition.effects]; 
                    break;
                case BuffStackingBehavior.NO_STACK:
                    // Buff already exists, do nothing
                    break;
                case BuffStackingBehavior.INDEPENDENT_STACKING:
                    // Add a new instance regardless
                    this.buffs.push({
                        type: definition.type,
                        expirationTimeMinutes: newExpirationTimeMinutes,
                        effects: [...definition.effects], // Create a new copy of effects
                        stackingBehavior: definition.stackingBehavior,
                        source: definition.displayName 
                    });
                    break;
                case BuffStackingBehavior.HIGHEST_EFFECT_WINS:
                    // This would require comparing effect values, more complex.
                    // For now, let's treat it like REFRESH_DURATION or log a warning.
                    existingBuff.expirationTimeMinutes = Math.max(existingBuff.expirationTimeMinutes, newExpirationTimeMinutes);
                    // Potentially update effects if new ones are "stronger"
                    break;
                default:
                    // Default to refresh if behavior is unknown
                    existingBuff.expirationTimeMinutes = Math.max(existingBuff.expirationTimeMinutes, newExpirationTimeMinutes);
                    break;
            }
        } else {
            // Buff does not exist, add new one
            this.buffs.push({
                type: definition.type,
                expirationTimeMinutes: newExpirationTimeMinutes,
                effects: [...definition.effects],
                stackingBehavior: definition.stackingBehavior,
                source: definition.displayName
            });
        }
    }

    public removeBuff(buffTypeToRemove: BuffType): void {
        this.buffs = this.buffs.filter(b => b.type != buffTypeToRemove);
    }

    public hasBuff(buffType: BuffType): boolean {
        return this.buffs.some(b => b.type == buffType);
    }

    public getBuff(buffType: BuffType): ActiveBuff | undefined {
        return this.buffs.find(b => b.type == buffType);
    }
}