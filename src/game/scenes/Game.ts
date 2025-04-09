import {EventBus} from '../EventBus';
import { Scene } from 'phaser';
import {GameDisplay} from "../display/GameDisplay.ts";
import {ECS} from "../ECS.ts";

export class Game extends Scene
{
    gameDisplay: GameDisplay;
    ecs:ECS;
    
    constructor ()
    {
        super('Game');
    }
    
    update(time: number, delta: number) {
        super.update(time, delta);
        
        // this.gameLogic.update(delta);
        this.gameDisplay.update(delta);
    }
    
    create ()
    {
        // this.cameras.main.setBackgroundColor('#2d2d2d');

        this.gameDisplay = new GameDisplay(this, this.ecs);
        
        EventBus.emit('current-scene-ready', this);
    }
}
