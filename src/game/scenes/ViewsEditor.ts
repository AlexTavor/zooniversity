import {EventBus} from '../EventBus';
import { Scene } from 'phaser';
import {GameDisplay} from "../display/GameDisplay.ts";
import {ECS} from "../ECS.ts";
import {ViewsEditorModule} from "../display/views_editor/ViewsEditorModule.ts";

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
        this.gameDisplay = new GameDisplay(this, this.ecs, [
            new ViewsEditorModule()
        ]);
        
        EventBus.emit('current-scene-ready', this);
    }
}
