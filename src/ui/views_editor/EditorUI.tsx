import React, { useEffect, useState } from 'react';
import { SpritePalette } from './SpritePalette';
import {EventBus} from "../../game/EventBus.ts";

export const EditorUI: React.FC = () => {
    const [sceneReady, setSceneReady] = useState(false);

    useEffect(() => {
        const handleReady = () => {
            setSceneReady(true);
        };

        EventBus.on('current-scene-ready', handleReady);
        return () => {
            EventBus.off('current-scene-ready', handleReady);
        };
    }, []);

    return (
        <div>
            {sceneReady && <SpritePalette />}
        </div>
    );
};
