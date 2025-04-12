import React from 'react';
import styles from './GameOverlayUI.module.css';
import {EditorUI} from "./views_editor/EditorUI.tsx"; // Import CSS Module

/**
 * GameOverlayUI Component
 * Renders an empty div positioned directly over the Phaser game canvas area,
 * intended to contain other absolutely positioned UI elements.
 */
const GameOverlayUI: React.FC = () => {
    return (
        <div
            id="game-overlay-ui"
            className={styles.gameOverlayUi}
        >
            {/* UI elements intended to overlay the game canvas go here. */}
            {/* They will need 'pointer-events: auto' to be interactive. */}
            <EditorUI/>
        </div>
    );
};

export default GameOverlayUI;
