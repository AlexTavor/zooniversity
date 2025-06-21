import React, { useEffect, useState } from "react";
import { GameEvent } from "../../game/consts/GameEvent.ts";
import { EventBus } from "../../game/EventBus.ts";
import { MainMenu } from "./main_menu/MainMenu.tsx";
import { TimeControls } from "./elements/time/TimeControls.tsx";
import { WeatherPanel } from "./weather/WeatherPanel.tsx";
import { ResourceDisplay } from "./resources/ResourceDisplay.tsx";
import { TopCharacterBar } from "./elements/top-char-bar/TopCharactersBar.tsx";
import { BottomBar } from "./elements/bottom-bar/BottomBar.tsx";
import { CharacterPortraitsLayer } from "./character_portaits/CharacterPortraitsLayer.tsx";
import { useToolCursor } from "./hooks/useToolCursor.tsx";

export const GameContainer: React.FC = () => {
    const [gameLoaded, setGameLoaded] = useState(false);

    useEffect(() => {
        const handler = () => setGameLoaded(true);
        EventBus.on(GameEvent.GameLoaded, handler);
        return () => {
            EventBus.off(GameEvent.GameLoaded, handler);
        };
    }, []);

    useToolCursor();

    return !gameLoaded ? (
        <MainMenu />
    ) : (
        <>
            <TimeControls />
            <WeatherPanel />
            <BottomBar />
            <ResourceDisplay />
            <CharacterPortraitsLayer />
            <TopCharacterBar />
        </>
    );
};
