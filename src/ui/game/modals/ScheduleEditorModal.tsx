import React, { useState, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import { useScheduleData } from "../hooks/useScheduleData";
import { ScheduleActivityType } from "../elements/icons/ScheduleIcon";
import { ScheduleSelectionBar } from "../schedule/ScheduleSelectionBar";
import { SCHEDULE_INTENTS } from "../../../game/logic/intent/intent-to-action/actionIntentData";

interface ScheduleEditorModalProps {
    entityId: number;
    onClose: () => void;
}

const ModalBackdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
`;

const ModalContent = styled.div`
    color: #dde;
    padding: 24px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 80%;
    max-width: 900px;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const Title = styled.h2`
    margin: 0;
    text-align: center;
    font-weight: 500;
    top: 0;
`;

const ScheduleGrid = styled.div`
    display: flex;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    height: 100%;
`;

export const ScheduleEditorModal: React.FC<ScheduleEditorModalProps> = ({
    entityId,
    onClose,
}) => {
    const {
        schedule: initialSchedule,
        fetchSchedule,
        updateSchedule,
    } = useScheduleData(entityId);

    const [editedSlots, setEditedSlots] = useState<
        ScheduleActivityType[] | null
    >(null);

    // Fetch data when the component mounts
    useEffect(() => {
        if (entityId) {
            fetchSchedule();
        }
    }, [entityId, fetchSchedule]);

    // Populate local state once data arrives
    useEffect(() => {
        if (initialSchedule) {
            setEditedSlots(initialSchedule.slots);
        }
    }, [initialSchedule]);

    const handleSlotUpdate = useCallback(
        (slotIndex: number, newActivity: ScheduleActivityType) => {
            setEditedSlots((prevSlots) => {
                if (!prevSlots) return null;
                const newSlots = [...prevSlots];
                newSlots[slotIndex] = newActivity;
                return newSlots;
            });
        },
        [],
    );

    // Saves the schedule and closes the modal.
    const handleSaveAndClose = () => {
        if (editedSlots) {
            updateSchedule(editedSlots);
            onClose();
        }
    };

    if (!editedSlots) {
        return (
            <ModalBackdrop onClick={handleSaveAndClose}>
                <ModalContent>Loading...</ModalContent>
            </ModalBackdrop>
        );
    }

    return (
        <ModalBackdrop onClick={handleSaveAndClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <Title>Edit Schedule</Title>
                <ScheduleGrid>
                    {editedSlots.map((activity, index) => (
                        <ScheduleSelectionBar
                            key={index}
                            allPossibleActivities={SCHEDULE_INTENTS}
                            selectedActivity={activity}
                            onSelected={(newActivity) =>
                                handleSlotUpdate(index, newActivity)
                            }
                        />
                    ))}
                </ScheduleGrid>
            </ModalContent>
        </ModalBackdrop>
    );
};
