// @ts-ignore
import React, { useRef } from 'react';
// Adjust import paths if needed
import { IRefPhaserGame, PhaserGame } from './game/PhaserGame';
import GameOverlayUI from './ui/GameOverlayUI'; // Your UI overlay component

function App() {
    // Ref for PhaserGame if needed
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    return (
        // Main App div - Example uses flex to center the game container on the page
        <div id="app" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>

            {/* This div is the key: it contains Phaser and the UI,
                and defines the bounds for the UI overlay. */}
            <div
                id="game-container"
                style={{
                    position: 'relative', // Establishes positioning context for children
                    overflow: 'hidden', // Optional: ensures nothing spills out
                }}
            >
                {/* PhaserGame renders its canvas inside this div */}
                <PhaserGame ref={phaserRef} />

                {/* The UI overlay component is also inside, positioned absolutely */}
                <GameOverlayUI />
            </div>

        </div>
    );
}

export default App;
