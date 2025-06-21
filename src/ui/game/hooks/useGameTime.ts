import { useEffect, useState } from "react";
import {TimeSpeed} from "../../../game/logic/input/InputComponent.ts";
import {EventBus} from "../../../game/EventBus.ts";
import {GameEvent} from "../../../game/consts/GameEvent.ts";
import {TimeConfig} from "../../../game/config/TimeConfig.ts";

export interface GameTime {
    minute: number;
    hour: number;
    day: number;
    semester: number;
    speed: TimeSpeed;
}

export function useGameTime(): GameTime {
    const [time, setTime] = useState<GameTime>({
        minute: 0,
        hour: 0,
        day: 0,
        semester: 0,
        speed: "normal" as TimeSpeed,
    });

    useEffect(() => {
        EventBus.on(GameEvent.SetTimeSpeed, (speed: TimeSpeed) =>
            setTime(prev => ({ ...prev, speed }))
        );
        
        EventBus.on(GameEvent.SetTime, (time: number) =>
            setTime(prev => ({ ...prev, ...divideTime(time) }))
        );
    }, []);

    return time;
}


export function divideTime(totalMinutes: number): Partial<GameTime> {
    const minutesPerHour = TimeConfig.MinutesPerHour;
    const hoursPerDay = TimeConfig.HoursPerDay;
    const daysPerSemester = TimeConfig.DaysPerSemester;

    let minutes = totalMinutes;

    const semester = Math.floor(minutes / (daysPerSemester * hoursPerDay * minutesPerHour));
    minutes %= daysPerSemester * hoursPerDay * minutesPerHour;

    const day = Math.floor(minutes / (hoursPerDay * minutesPerHour));
    minutes %= hoursPerDay * minutesPerHour;

    const hour = Math.floor(minutes / minutesPerHour);
    minutes %= minutesPerHour;

    return {
        semester,
        day,
        hour,
        minute: minutes
    };
}
