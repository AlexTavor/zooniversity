import {EventBus} from '../EventBus';
import { Scene } from 'phaser';
import {GameDisplay} from "../display/GameDisplay.ts";
import {ECS} from "../ECS.ts";
import {CameraModule} from "../display/camera/CameraModule.ts";
import {DragManager} from "../display/views_editor/DragManager.ts";
import {setDragManager} from "../display/views_editor/DragManagerRef.ts";

export class ViewsEditor extends Scene
{
    gameDisplay: GameDisplay;
    ecs:ECS;
    
    constructor ()
    {
        super('ViewsEditor');
    }
    
    update(time: number, delta: number) {
        super.update(time, delta);
        
        // this.gameLogic.update(delta);
        this.gameDisplay.update(delta);
    }
    
    create ()
    {
        const dragManager = new DragManager(this);
        setDragManager(dragManager);
        
        this.gameDisplay = new GameDisplay(this, this.ecs, [
            new CameraModule()
        ]);
        
        EventBus.emit('current-scene-ready', this);
    }
}
