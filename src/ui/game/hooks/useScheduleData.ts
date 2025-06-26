import { useState, useEffect, useCallback, useRef } from "react";
import { EventBus } from "../../../game/EventBus";
import { GameEvent } from "../../../game/consts/GameEvent";
import { ScheduleActivityType } from "../elements/icons/ScheduleIcon";

/**
 * The data structure for a schedule, used by UI components.
 */
export interface ScheduleUIData {
    slots: ScheduleActivityType[];
    currentSlotIndex: number;
}

/**
 * The payload for the response event when schedule data is fetched.
 */
interface ScheduleFetchResponse {
    requestId: number;
    schedule: ScheduleUIData;
}

/**
 * A custom hook to manage fetching and updating a specific entity's schedule data.
 * It uses a request/response event pattern to communicate with the game logic layer.
 *
 * @param entityId The ID of the entity whose schedule is being managed.
 * @returns An object containing the current schedule, a function to fetch it,
 * and a function to request an update.
 */
export function useScheduleData(entityId: number | null) {
    const [schedule, setSchedule] = useState<ScheduleUIData | null>(null);
    const requestIdRef = useRef<number | null>(null);

    // Effect for listening to the data response from the game logic
    useEffect(() => {
        const handleResponse = (data: ScheduleFetchResponse) => {
            // Only accept the data if the request ID matches the last one we sent
            if (data.requestId === requestIdRef.current) {
                setSchedule(data.schedule);
                requestIdRef.current = null; // Clear the ID after fulfillment
            }
        };

        EventBus.on(GameEvent.ScheduleFetchSucceeded, handleResponse);

        return () => {
            EventBus.off(GameEvent.ScheduleFetchSucceeded, handleResponse);
        };
    }, []); // Empty dependency array ensures this runs only on mount and unmount

    // Function to trigger the data fetch
    const fetchSchedule = useCallback(() => {
        if (entityId === null) {
            setSchedule(null); // Clear data if entityId is cleared
            return;
        }

        const newRequestId = Date.now() + Math.random();
        requestIdRef.current = newRequestId;

        EventBus.emit(GameEvent.ScheduleFetchRequested, {
            entityId,
            requestId: newRequestId,
        });
    }, [entityId]);

    // Function to send updated schedule data back to the game logic
    const updateSchedule = useCallback(
        (newSlots: ScheduleActivityType[]) => {
            if (entityId === null) return;

            EventBus.emit(GameEvent.ScheduleUpdateRequest, {
                entityId,
                updatedSlots: newSlots,
            });
        },
        [entityId],
    );

    return { schedule, fetchSchedule, updateSchedule };
}
