// @ts-ignore
import React, { useRef } from 'react';
import { IRefPhaserGame, PhaserGame } from './game/PhaserGame';
import {ToolsContainer} from "./ui/tools/ToolsContainer.tsx"; 

export function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    return (
        <div id="app">
            <div id="game-wrapper">
                <PhaserGame ref={phaserRef} />
                <ToolsContainer />
            </div>
        </div>
    );
}
