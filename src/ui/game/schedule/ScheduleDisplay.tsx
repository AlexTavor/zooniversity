import React from "react";
import styled from "@emotion/styled";
import {
    ScheduleIcon,
    ScheduleActivityType,
} from "../elements/icons/ScheduleIcon";
import { EventBus } from "../../../game/EventBus";
import { GameEvent } from "../../../game/consts/GameEvent";
import { ModalType } from "../modals/ModalManager";

export interface ScheduleUIData {
    slots: ScheduleActivityType[]; // Array representing each hour/block of the day
    currentSlotIndex: number; // Index of the current time slot to highlight
}

interface ScheduleDisplayProps {
    entity: number; // The entity this schedule belongs to
    scheduleData: ScheduleUIData;
    className?: string;
    iconSize?: string; // Size for each ScheduleIcon
    activeIconSize?: string; // Size for each ScheduleIcon
    activeBorderColor?: string; // Border color for the active ScheduleIcon
    inactiveOpacity?: number; // Opacity for inactive ScheduleIcons
}

const ScheduleDisplayWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around; /* Or 'flex-start' with gap */
    align-items: center;
    width: 100%;
    padding: 4px; /* Optional padding around the strip */
    box-sizing: border-box;
    gap: 2px; /* Optional gap between icons */
`;

export const ScheduleDisplay: React.FC<ScheduleDisplayProps> = ({
    scheduleData,
    className,
    iconSize = "24px", // Default size for schedule icons
    activeIconSize = "24px",
    activeBorderColor, // Uses ScheduleIcon's default if not provided
    inactiveOpacity, // Uses ScheduleIcon's default if not provided
    entity,
}) => {
    const { slots, currentSlotIndex } = scheduleData;

    if (!slots || slots.length === 0) {
        return null;
    }

    return (
        <ScheduleDisplayWrapper
            className={className}
            onClick={() => {
                EventBus.emit(GameEvent.ShowModal, {
                    type:ModalType.ScheduleEditor, props:{entityId: entity},
                });
            }}
        >
            {slots.map((activityType, index) => (
                <ScheduleIcon
                    key={index} // Using index as key is acceptable if schedule order is stable and has no unique IDs per slot
                    activityType={activityType}
                    isActive={index === currentSlotIndex}
                    size={index == currentSlotIndex ? activeIconSize : iconSize}
                    activeBorderColor={activeBorderColor}
                    inactiveOpacity={inactiveOpacity}
                    // alt text for accessibility can be derived if needed, ScheduleIcon has a default
                />
            ))}
        </ScheduleDisplayWrapper>
    );
};
