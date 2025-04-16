import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { AUTO, Game as PhaserGame } from 'phaser';
import { Preloader } from './scenes/Preloader';
import OutlinePipelinePlugin from 'phaser3-rex-plugins/plugins/outlinepipeline-plugin.js';
import {Config} from "./config/Config.ts";
import {GameEditorTools} from "./scenes/GameEditorTools.ts";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    mode: Phaser.Scale.FIT,
    width: Config.Display.Width,
    height: Config.Display.Height,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        Boot,
        Preloader,
        Game,
        GameEditorTools,
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