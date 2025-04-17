import React from 'react';
import {useActiveSceneType} from "./useActiveSceneType.ts";
import {ToolsContainer} from "../tools/ToolsContainer.tsx";
import {GameContainer} from "../game/GameContainer.tsx";

export const UISwitcher: React.FC = () => {
    const sceneType = useActiveSceneType();

    switch (sceneType) {
        case 'editor':
            return <ToolsContainer />;
        case 'game':
            return <GameContainer />;
        default:
            return null; // or a <LoadingScreen /> or <ErrorFallback />
    }
};
