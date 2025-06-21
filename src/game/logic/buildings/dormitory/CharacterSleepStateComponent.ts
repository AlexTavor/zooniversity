import { Component } from "../../../ECS"; // Adjust path as needed

/**
 * Tracks the state of an entity currently performing the SLEEPING action,
 * primarily to determine sleep duration for effects like the "Rested" buff.
 */
export class CharacterSleepStateComponent extends Component {
    /** Game time in total minutes (e.g., from TimeComponent.minutesElapsed) when the SLEEPING action began. */
    public sleepStartTimeMinutes: number;

    constructor(sleepStartTimeMinutes: number) {
        super();
        this.sleepStartTimeMinutes = sleepStartTimeMinutes;
    }
}
