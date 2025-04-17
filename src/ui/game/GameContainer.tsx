import React, { useEffect, useState } from "react";
import {GameEvent} from "../../game/consts/GameEvents.ts";
import {EventBus} from "../../game/EventBus.ts";
import {MainMenu} from "./main_menu/MainMenu.tsx";

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
            {/* Future: other game UI elements here */}
        </>
    );
};
