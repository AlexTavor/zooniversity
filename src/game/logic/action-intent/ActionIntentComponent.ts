import { Component } from "../../ECS";
import { CharacterIntent, CharacterAction } from "./actionIntentData";

/**
 * ActionIntentComponent stores a character's high-level intent and their
 * current, concrete performed action. Data specific to the current action
 * is stored in the `actionData` payload.
 */
export class ActionIntentComponent extends Component {
    /** The character's current high-level goal or scheduled task. */
    public intentType: CharacterIntent = CharacterIntent.NONE;

    /** The specific, observable action the character is currently performing. */
    public currentPerformedAction: CharacterAction = CharacterAction.IDLE;
    
    public schduleOverrideStartHour: number = -1; // -1 means no override
    
    /** * Holds data specific to the `currentPerformedAction`. 
     * Its structure is determined by the action (e.g., WalkingData, ChoppingData).
     * Managed by IntentActionSystem (and its helpers). Should be null if no data needed.
     */
    public actionData: any | null = null;

    constructor(initialIntent: CharacterIntent = CharacterIntent.NONE) {
        super();
        this.intentType = initialIntent;
    }
}