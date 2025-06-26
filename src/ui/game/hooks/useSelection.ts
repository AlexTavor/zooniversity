import { useState, useEffect } from "react";
import { EventBus } from "../../../game/EventBus";
import { GameEvent } from "../../../game/consts/GameEvent";

/**
 * A simple hook to get the ID of the currently selected entity.
 * @returns The entityId of the current selection, or null.
 */
export function useSelection(): number | null {
    const [selectedEntityId, setSelectedEntityId] = useState<number | null>(
        null,
    );

    useEffect(() => {
        const handleSelectionChange = (entityId: number) => {
            // The event sends -1 for no selection; we'll store it as null.
            setSelectedEntityId(entityId === -1 ? null : entityId);
        };

        EventBus.on(GameEvent.SelectionChanged, handleSelectionChange);

        return () => {
            EventBus.off(GameEvent.SelectionChanged, handleSelectionChange);
        };
    }, []);

    return selectedEntityId;
}
