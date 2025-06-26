import React, { useState, useEffect, useCallback } from "react";
import { EventBus } from "../../../game/EventBus";
import { GameEvent } from "../../../game/consts/GameEvent";
import { ScheduleEditorModal } from "./ScheduleEditorModal";

// Defines the shape of the state that determines which modal is active
interface ModalState {
    type: "schedule" | null; // Add other modal types here, e.g., 'inventory' | 'character-stats'
    props: any;
}

/**
 * A top-level component that listens for requests to open modals and renders
 * the active one.
 */
export const ModalManager: React.FC = () => {
    const [activeModal, setActiveModal] = useState<ModalState>({
        type: null,
        props: {},
    });

    const handleClose = useCallback(() => {
        setActiveModal({ type: null, props: {} });
    }, []);

    useEffect(() => {
        // Handler for showing the schedule editor
        const handleShowScheduleEditor = (props: { entityId: number }) => {
            setActiveModal({ type: "schedule", props });
        };

        // Subscribe to all events that can open a modal
        EventBus.on(GameEvent.ShowScheduleEditor, handleShowScheduleEditor);

        // Cleanup function to unsubscribe from all events
        return () => {
            EventBus.off(
                GameEvent.ShowScheduleEditor,
                handleShowScheduleEditor,
            );
        };
    }, []);

    // Render the correct modal based on the active state
    switch (activeModal.type) {
        case "schedule":
            return (
                <ScheduleEditorModal
                    {...activeModal.props}
                    onClose={handleClose}
                />
            );
        // Add other cases for different modals here
        // case 'inventory':
        //   return <InventoryModal {...activeModal.props} onClose={handleClose} />;
        default:
            return null;
    }
};
