// src/ui/panel/schedule/ScheduleSelectionBar.tsx

import React, { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import {
    ScheduleActivityType,
    ScheduleIcon,
} from "../elements/icons/ScheduleIcon";

interface ScheduleSelectionBarProps {
    allPossibleActivities: ScheduleActivityType[];
    selectedActivity: ScheduleActivityType;
    onSelected: (newActivity: ScheduleActivityType) => void;
    className?: string;
}

const SelectionBarWrapper = styled.div`
    position: relative;
    height: 50%;
    width: 48px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
`;

const SelectionIndicator = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% - 4px);
    height: 48px; /* Should match the icon size */
    border: 2px solid #ffd700;
    border-radius: 6px;
    pointer-events: none;
    z-index: 2;
    box-sizing: border-box;
`;

// This container is no longer scrolled, but translated.
const IconListContainer = styled.div<{ yOffset: number }>`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* Apply the vertical shift using a hardware-accelerated transform */
    transform: translateY(${(props) => props.yOffset}px);
    /* Animate the transform property for a smooth "tumbler" effect */
    transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
`;

const IconWrapper = styled.div`
    padding: 4px 0;
    flex-shrink: 0;
    cursor: pointer;
`;

export const ScheduleSelectionBar: React.FC<ScheduleSelectionBarProps> = ({
    allPossibleActivities,
    selectedActivity,
    onSelected,
    className,
}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [yOffset, setYOffset] = useState(0);

    // This effect runs whenever the selected activity changes to calculate the new offset.
    useEffect(() => {
        const selectedIndex = allPossibleActivities.indexOf(selectedActivity);
        const wrapperEl = wrapperRef.current;
        const selectedIconEl = iconRefs.current[selectedIndex];

        if (wrapperEl && selectedIconEl) {
            const containerHeight = wrapperEl.offsetHeight;
            const iconTop = selectedIconEl.offsetTop;
            const iconHeight = selectedIconEl.offsetHeight;

            // Calculate the offset needed to center the icon inside the wrapper
            const centeringOffset =
                iconTop - containerHeight / 2 + iconHeight / 2;

            // Update the state to trigger the CSS transform
            setYOffset(-centeringOffset);
        }
    }, [selectedActivity, allPossibleActivities]);

    return (
        <SelectionBarWrapper className={className} ref={wrapperRef}>
            <SelectionIndicator />
            <IconListContainer yOffset={yOffset}>
                {allPossibleActivities.map((activity, index) => (
                    <IconWrapper
                        key={activity}
                        ref={(el) => (iconRefs.current[index] = el)}
                        onClick={() => onSelected(activity)}
                    >
                        <ScheduleIcon
                            activityType={activity}
                            isActive={selectedActivity === activity}
                            size={"48px"}
                            activeBorderColor={"transparent"}
                            borderColor={"transparent"}
                            inactiveOpacity={0.6}
                        />
                    </IconWrapper>
                ))}
            </IconListContainer>
        </SelectionBarWrapper>
    );
};
