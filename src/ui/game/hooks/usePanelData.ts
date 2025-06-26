import { useState, useEffect, useRef } from "react";
import { EventBus } from "../../../game/EventBus";
import { GameEvent } from "../../../game/consts/GameEvent";
import { PanelData } from "../../../game/display/api/PanelApi";

/**
 * The payload for the response to a direct "pull" request.
 */
interface PanelDataResponse {
    requestId: number;
    panelData: PanelData | null;
}

/**
 * The payload for a proactive "push" update from the game logic.
 */
interface PanelDataPush {
    panelData: PanelData | null;
}

/**
 * A custom hook that manages the state of the main selection panel.
 * It "pulls" initial data on selection and then receives "push" updates
 * for live data changes.
 *
 * @param entityId The entity ID of the currently selected object, or null if none.
 * @returns The PanelData for the currently selected entity, or null.
 */
export function usePanelData(entityId: number | null): PanelData | null {
    const [panelData, setPanelData] = useState<PanelData | null>(null);
    const requestIdRef = useRef<number | null>(null);

    // This effect runs once to set up listeners for both pull and push data events.
    useEffect(() => {
        // Handles the response to our specific "pull" request.
        const handleFetchResponse = (response: PanelDataResponse) => {
            if (response.requestId === requestIdRef.current) {
                setPanelData(response.panelData);
                requestIdRef.current = null; // Clear request ID after fulfillment
            }
        };

        // Handles proactive "push" updates from the PanelApi's update loop.
        const handlePushUpdate = (pushed: PanelDataPush) => {
            // Only accept the pushed data if it's for the currently selected entity.
            // This prevents race conditions if the selection changes quickly.
            if (pushed.panelData?.id === entityId) {
                setPanelData(pushed.panelData);
            }
        };

        EventBus.on(GameEvent.FetchPanelDataSucceeded, handleFetchResponse);
        EventBus.on(GameEvent.PanelDataUpdated, handlePushUpdate);

        return () => {
            EventBus.off(
                GameEvent.FetchPanelDataSucceeded,
                handleFetchResponse,
            );
            EventBus.off(GameEvent.PanelDataUpdated, handlePushUpdate);
        };
    }, [entityId]); // Dependency on entityId ensures the push handler closes over the correct ID.

    // This effect triggers a new data "pull" whenever the selected entityId changes.
    useEffect(() => {
        if (entityId === null || entityId === -1) {
            setPanelData(null); // Clear panel if nothing is selected
            return;
        }

        const newRequestId = Math.floor(Date.now() + Math.random());
        requestIdRef.current = newRequestId;

        // Fire the event to "pull" the initial data for the new selection.
        EventBus.emit(GameEvent.FetchPanelDataRequested, {
            entityId,
            requestId: newRequestId,
        });
    }, [entityId]);

    return panelData;
}
