import {EventBus} from '../EventBus';
import { Scene } from 'phaser';
import {ECS} from "../ECS.ts";
import {CameraModule} from "../display/camera/CameraModule.ts";
import {GameDisplay} from "../display/GameDisplay.ts";
import {setSceneType} from "../../ui/ui_switcher/useActiveSceneType.ts";
import {GameEvent} from "../consts/GameEvents.ts";
import {GameState} from "../logic/serialization/GameState.ts";
import {loadFromState} from "../logic/serialization/GameStateSerializer.ts";
import {loadNewGame} from "../logic/serialization/MapSerializer.ts";

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
        this.ecs = new ECS();
        
        this.gameDisplay = new GameDisplay(this, this.ecs, [
            new CameraModule()
        ]);
        
        EventBus.emit('current-scene-ready', this);
        setSceneType('game');

        EventBus.on(GameEvent.NewGame, () => {
            loadNewGame(this.ecs, this);
        });

        EventBus.on(GameEvent.LoadGame, (state: GameState) => {
            loadFromState(this.ecs, state);
        });
    }
}
