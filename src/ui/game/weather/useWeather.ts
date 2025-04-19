import { useEffect, useState } from "react";
import {WeatherComponent} from "../../../game/logic/weather/WeatherComponent.ts";
import {GameEvent} from "../../../game/consts/GameEvents.ts";
import {EventBus} from "../../../game/EventBus.ts";

export function useWeather(): WeatherComponent | null {
    const [weather, setWeather] = useState<WeatherComponent | null>(null);

    // @ts-ignore
    useEffect(() => {
        const handler = (payload: WeatherComponent) => {
            setWeather({ ...payload });
        };

        EventBus.on(GameEvent.SetWeather, handler);
        return () => EventBus.off(GameEvent.SetWeather, handler);
    }, []);

    return weather;
}
