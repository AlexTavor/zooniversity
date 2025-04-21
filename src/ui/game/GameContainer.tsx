import React, { useEffect, useState } from "react";
import {GameEvent} from "../../game/consts/GameEvents.ts";
import {EventBus} from "../../game/EventBus.ts";
import {MainMenu} from "./main_menu/MainMenu.tsx";
import {TimeControls} from "./time_controls/TimeControls.tsx";
import {WeatherPanel} from "./weather/WeatherPanel.tsx";
import {SelectionPanel} from "./selection/SelectionPanel.tsx";

export const GameContainer: React.FC = () => {
    const [gameLoaded, setGameLoaded] = useState(false);

    useEffect(() => {
        const handler = () => setGameLoaded(true);
        EventBus.on(GameEvent.GameLoaded, handler);
        return () => {
            EventBus.off(GameEvent.GameLoaded, handler);
        };
    }, []);

    return (
        <>
            {!gameLoaded && <MainMenu />}
            {gameLoaded && <TimeControls/>}
            {gameLoaded && <WeatherPanel/>}
            {gameLoaded && <SelectionPanel/>}
        </>
    );
};
