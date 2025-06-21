import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { AUTO, Game as PhaserGame } from 'phaser';
import { Preloader } from './scenes/Preloader';
import {Config} from "./config/Config.ts";
import OutlinePipelinePlugin from '../render/pipelines/OutlinePipelinePlugin.ts';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: Config.Display.Width,
    height: Config.Display.Height,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [
        Boot,
        Preloader,
        Game
    ],
    plugins: {
        global: [
            { key: 'OutlinePlugin', plugin: OutlinePipelinePlugin, start: true}
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
    disableContextMenu: false
};

const StartGame = (parent: string) => {
    return new PhaserGame({ ...config, parent });
}

export default StartGame;