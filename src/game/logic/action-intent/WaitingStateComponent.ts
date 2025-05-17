import { Component } from "../../ECS";
import { CharacterIntent } from "./actionIntentData";

/**
 * Added to a character when their currentPerformedAction is WAITING
 * because their primary intent is blocked.
 * Used by IdleBehaviorSystem to determine if they've been waiting too long.
 */
export class WaitingStateComponent extends Component {
    /**
     * Game time (e.g., from TimeComponent.minutesElapsed or a similar global timer)
     * when the character started waiting for this particular blocked intent.
     */
    public waitStartTime: number;

    /**
     * The original CharacterIntent that was blocked, causing the character to wait.
     * This helps IdleBehaviorSystem decide if the waiting is for a primary task.
     */
    public originalBlockedIntent: CharacterIntent;

    /**
     * Optional: A brief reason or context for why the character is waiting.
     * (e.g., "no_available_tree", "no_sleep_slot", "path_blocked")
     */
    public reason?: string;

    constructor(
        waitStartTime: number,
        originalBlockedIntent: CharacterIntent,
        reason?: string
    ) {
        super();
        this.waitStartTime = waitStartTime;
        this.originalBlockedIntent = originalBlockedIntent;
        this.reason = reason;
    }
}