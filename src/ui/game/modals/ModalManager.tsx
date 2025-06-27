import React, { useState, useEffect, useCallback } from "react";
import { EventBus } from "../../../game/EventBus";
import { GameEvent } from "../../../game/consts/GameEvent";
import { ScheduleEditorModal } from "./ScheduleEditorModal";
import { ProjectStatusModal } from "./ProjectStatusModal"; // Import the new modal

// Enum to define all possible modal types
export enum ModalType {
    ScheduleEditor = "schedule",
    ProjectStatus = "project_status",
}

// Defines the shape of the state that determines which modal is active
interface ModalState {
    type: ModalType | null;
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
        // A single handler for showing any modal
        const handleShowModal = (data: { type: ModalType, props: any }) => {setActiveModal({ type: data.type, props: data.props });
        };

        // Subscribe to the generic ShowModal event
        EventBus.on(GameEvent.ShowModal, handleShowModal);

        // Cleanup function to unsubscribe
        return () => {
            EventBus.off(GameEvent.ShowModal, handleShowModal);
        };
    }, []);

    // Render the correct modal based on the active state
    switch (activeModal.type) {
        case ModalType.ScheduleEditor:
            return (
                <ScheduleEditorModal
                    {...activeModal.props}
                    onClose={handleClose}
                />
            );
        case ModalType.ProjectStatus:
            return (
                <ProjectStatusModal
                    {...activeModal.props}
                    onClose={handleClose}
                />
            );
        default:
            return null;
    }
};