import React, { useCallback, useMemo } from "react";
import "./TimeControls.css";
import {useGameTime} from "./useGameTime.ts";
import {TimeSpeed} from "../../../game/logic/input/InputComponent.ts";
import {EventBus} from "../../../game/EventBus.ts";
import {GameEvent} from "../../../game/consts/GameEvent.ts";

const speeds: { label: string; value: TimeSpeed }[] = [
    { label: "⏸", value: "paused" },
    { label: "▶", value: "normal" },
    { label: "⏩", value: "fast" },
    { label: "⏭", value: "veryfast" },
];


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
        [speed]
    );

    return (
        <div className="time-controls">
            <div className="time-buttons">
                {speeds.map(({ label, value }) => (
                    <button
                        key={value}
                        className={`time-button ${speed === value ? "active" : ""}`}
                        onClick={() => handleClick(value)}
                    >
                        {label}
                    </button>
                ))}
            </div>
            <div className="time-raw-large">{timeRaw}</div>
        </div>
    );
};