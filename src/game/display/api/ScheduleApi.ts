import { EventBus } from "../../EventBus";
import { GameEvent } from "../../consts/GameEvent";
import { GameDisplayContext } from "../../display/GameDisplay";
import { DisplayModule } from "../../display/setup/DisplayModule";
import { Entity } from "../../ECS";
import {
    ScheduleComponent,
    ScheduleEntry,
} from "../../logic/characters/ScheduleComponent";
import { getTime } from "../../logic/time/TimeComponent";

/**
 * An API module that handles all UI requests related to character schedules.
 * It fetches schedule data from the ECS and applies updates back to it.
 */
export class ScheduleApi extends DisplayModule<GameDisplayContext> {
    private context!: GameDisplayContext;

    /**
     * Initializes the module and subscribes to schedule-related UI events.
     */
    public init(context: GameDisplayContext): void {
        this.context = context;
        EventBus.on(
            GameEvent.ScheduleFetchRequested,
            this.handleFetchRequest,
            this,
        );
        EventBus.on(
            GameEvent.ScheduleUpdateRequest,
            this.handleUpdateRequest,
            this,
        );
    }

    /**
     * Unsubscribes from all events to prevent memory leaks.
     */
    public destroy(): void {
        EventBus.off(
            GameEvent.ScheduleFetchRequested,
            this.handleFetchRequest,
            this,
        );
        EventBus.off(
            GameEvent.ScheduleUpdateRequest,
            this.handleUpdateRequest,
            this,
        );
    }

    public update(_delta: number): void {
        // This module is event-driven.
    }

    /**
     * Handles a request to fetch schedule data for a given entity.
     * @param payload - Contains the entityId and a unique requestId.
     */
    private handleFetchRequest(payload: {
        entityId: Entity;
        requestId: number;
    }): void {
        const { entityId, requestId } = payload;
        const ecs = this.context.ecs;

        const schedule = ecs.getComponent(entityId, ScheduleComponent);
        const time = getTime(ecs);

        if (!schedule || !time) {
            console.warn(
                `ScheduleApi: Could not find Schedule or Time component for entity ${entityId}.`,
            );
            return;
        }

        const scheduleData = {
            slots: schedule.entries,
            currentSlotIndex: time.hour,
        };

        // Emit the success event with the fetched data and original request ID
        EventBus.emit(GameEvent.ScheduleFetchSucceeded, {
            requestId,
            schedule: scheduleData,
        });
    }

    /**
     * Handles a command to update an entity's schedule.
     * @param payload - Contains the entityId and the new array of schedule slots.
     */
    private handleUpdateRequest(payload: {
        entityId: Entity;
        updatedSlots: ScheduleEntry[];
    }): void {
        const { entityId, updatedSlots } = payload;
        const ecs = this.context.ecs;

        const schedule = ecs.getComponent(entityId, ScheduleComponent);

        if (schedule) {
            schedule.entries = updatedSlots;
        } else {
            console.warn(
                `ScheduleApi: Tried to update a schedule for entity ${entityId}, but it has no ScheduleComponent.`,
            );
        }
    }
}
