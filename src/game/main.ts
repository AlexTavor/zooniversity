import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { AUTO, Game as PhaserGame } from 'phaser';
import { Preloader } from './scenes/Preloader';
import OutlinePipelinePlugin from 'phaser3-rex-plugins/plugins/outlinepipeline-plugin.js';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 800,
    height: 800,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        Boot,
        Preloader,
        Game
    ],
    plugins: {
        global: [
            { key: 'rexOutlinePipeline', plugin: OutlinePipelinePlugin, start: true}
        ]
    },
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    disableContextMenu: true
};

const StartGame = (parent: string) => {
    return new PhaserGame({ ...config, parent });
}

export default StartGame;