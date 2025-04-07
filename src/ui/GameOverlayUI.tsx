import React from 'react';
import styles from './GameOverlayUI.module.css'; // Import CSS Module

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
        </div>
    );
};

export default GameOverlayUI;
