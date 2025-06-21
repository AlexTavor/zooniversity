// src/ui/time_controls/TimeControls.tsx
import React, { useCallback, useMemo } from "react";
import styled from "@emotion/styled";
import { useGameTime } from "../../hooks/useGameTime"; // Assuming this path is correct relative to the new file
import { TimeSpeed } from "../../../../game/logic/input/InputComponent"; // Adjust path
import { EventBus } from "../../../../game/EventBus"; // Adjust path
import { GameEvent } from "../../../../game/consts/GameEvent"; // Adjust path

const SPEEDS_CONFIG: { label: string; value: TimeSpeed; title: string }[] = [
    { label: "⏸", value: "paused", title: "Pause" },
    { label: "1x", value: "normal", title: "Normal Speed" },
    { label: "12x", value: "fast", title: "Fast Speed" },
    { label: "60x", value: "veryfast", title: "Very Fast Speed" },
];

const ControlsWrapper = styled.div`
    position: absolute;
    top: 10px;
    left: 10px;
    height: 32px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 4px;
    background-color: rgba(30, 32, 35, 0.5);
    color: #dde;
    border-radius: 6px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    z-index: 1010;
    pointer-events: auto;
`;

const TimeButtonStyled = styled.button<{ isActive: boolean }>`
    background-color: ${(props) =>
        props.isActive ? "rgba(70, 90, 120, 0.9)" : "rgba(50, 52, 55, 0)"};
    color: ${(props) => (props.isActive ? "#FFFFFF" : "#a0a0a0")};
    border: 1px solid
        ${(props) => (props.isActive ? "rgba(100, 120, 150, 0.9)" : "#2a2c2e")};
    font-size: 0.8rem;
    padding: 0;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
        background-color 0.15s ease,
        color 0.15s ease,
        border-color 0.15s ease;

    &:hover:not(:disabled) {
        background-color: ${(props) =>
            props.isActive
                ? "rgba(80, 100, 130, 0.9)"
                : "rgba(60, 62, 65, 0.9)"};
        color: #ffffff;
    }
`;

const TimeDisplayStyled = styled.div`
    font-family: "Consolas", "Menlo", monospace;
    font-size: 0.8rem;
    font-weight: 600;
    color: #e0e0e0;
    padding: 0 0px;
    min-width: 72px;
    text-align: center;
    white-space: nowrap;
`;

export const TimeControls: React.FC = () => {
    const { speed, hour, minute, day, semester } = useGameTime();

    const timeRaw = useMemo(() => {
        return `${Math.round(minute)}|${Math.round(hour)}|${Math.round(day)}|${Math.round(semester)}`;
    }, [minute, hour, day, semester]);

    const handleClick = useCallback(
        (newSpeed: TimeSpeed) => {
            if (newSpeed !== speed) {
                EventBus.emit(GameEvent.SetTimeSpeed, newSpeed);
            }
        },
        [speed],
    );

    return (
        <ControlsWrapper>
            {SPEEDS_CONFIG.map(({ label, value, title }) => (
                <TimeButtonStyled
                    key={value}
                    isActive={speed === value}
                    onClick={() => handleClick(value)}
                    title={title}
                >
                    {label}
                </TimeButtonStyled>
            ))}
            <TimeDisplayStyled>{timeRaw}</TimeDisplayStyled>
        </ControlsWrapper>
    );
};
