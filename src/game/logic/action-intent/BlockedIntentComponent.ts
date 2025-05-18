import { Component, Entity } from "../../ECS";
import { BlockedIntentReason, CharacterIntent } from "./actionIntentData";

/**
 * Added to a character when their primary intent is blocked.
 * Used by BlockedIntentSystem to periodically re-check if the original intent can be resumed.
 * Also used by ScheduleSystem to clear this state if a new scheduled intent takes precedence.
 */
export class BlockedIntentComponent extends Component {
    /** The CharacterIntent that was blocked. */
    public originalIntentType: CharacterIntent;

    /** The reason why the originalIntentType was blocked. */
    public reason: BlockedIntentReason;

    /** Optional: The specific entity that was the target of the blocked intent, if applicable. */
    public specificBlockedTargetId?: Entity;

    /**
     * Optional: Cooldown timer (e.g., in milliseconds or game time units)
     * to prevent BlockedIntentSystem from re-checking conditions too frequently.
     * BlockedIntentSystem would decrement this and only re-check when it reaches zero.
     */
    public reCheckCooldown?: number; 

    constructor(
        originalIntentType: CharacterIntent,
        reason: BlockedIntentReason,
        specificBlockedTargetId?: Entity,
        initialReCheckCooldown?: number // e.g., time in ms or game minutes before first re-check
    ) {
        super();
        this.originalIntentType = originalIntentType;
        this.reason = reason;
        this.specificBlockedTargetId = specificBlockedTargetId;
        this.reCheckCooldown = initialReCheckCooldown;
    }
}