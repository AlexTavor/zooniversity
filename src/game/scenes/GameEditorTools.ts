import {EventBus} from '../EventBus';
import { Scene } from 'phaser';
import {GameDisplay} from "../display/GameDisplay.ts";
import {ECS} from "../ECS.ts";
import {EditorHost} from "../display/editor/EditorHost.ts";

export class GameEditorTools extends Scene
{
    gameDisplay: GameDisplay;
    ecs:ECS;
    
    constructor ()
    {
        super('GameEditorTools');
    }
    
    update(time: number, delta: number) {
        super.update(time, delta);
        
        // this.gameLogic.update(delta);
        this.gameDisplay.update(delta);
    }
    
    create ()
    {
        this.gameDisplay = new GameDisplay(this, this.ecs, [
            new EditorHost()
        ]);
        
        EventBus.emit('current-scene-ready', this);
    }
}
