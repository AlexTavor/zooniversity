import React, { useEffect, useState } from 'react';
import {EventBus} from "../../game/EventBus.ts";
import {EditorSidebar} from "./sidebar/EditorSidebar.tsx";
import {Toolbox} from "./toolbox/Toolbox.tsx";

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

    return !sceneReady ? null : (
        <div style={{height:"inherit", position:"relative"}}>
            <EditorSidebar />
            <Toolbox />
        </div>
    );
};
