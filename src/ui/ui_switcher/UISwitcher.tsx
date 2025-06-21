import React from "react";
import { useActiveSceneType } from "./useActiveSceneType.ts";
import { GameContainer } from "../game/GameContainer.tsx";

export const UISwitcher: React.FC = () => {
    const sceneType = useActiveSceneType();

    switch (sceneType) {
        case "editor":
            return <></>;
        case "game":
            return <GameContainer />;
        default:
            return null;
    }
};
