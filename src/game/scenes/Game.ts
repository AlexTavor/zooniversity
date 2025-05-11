import {EventBus} from '../EventBus';
import { Scene } from 'phaser';
import {ECS} from "../ECS.ts";
import {GameDisplay} from "../display/GameDisplay.ts";
import {setSceneType} from "../../ui/ui_switcher/useActiveSceneType.ts";
import {GameEvent} from "../consts/GameEvent.ts";
import {GameState} from "../logic/serialization/GameState.ts";
import {loadFromState} from "../logic/serialization/GameStateSerializer.ts";
import {loadNewGame} from "../logic/serialization/MapSerializer.ts";
import {TimeTintPipeline} from "../../render/pipelines/TimeTintPipeline.ts";
import { initDisplay, initSystems } from '../logic/serialization/init.ts';

export class Game extends Scene
{
    gameDisplay: GameDisplay;
    ecs:ECS;
    
    destroyQueue: Array<()=>void> = [];
    
    constructor ()
    {
        super('Game');
    }
    
    update(time: number, delta: number) {
        super.update(time, delta);
        
        this.ecs?.update(delta);
        this.gameDisplay?.update(delta);
    }

    create ()
    {
        EventBus.emit('current-scene-ready', this);
        setSceneType('game');

        const pipeline = new TimeTintPipeline(this.game);
        (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer)
            .pipelines
            .add('TimeTint', pipeline);
 
        this.ecs = new ECS();
        
        EventBus.on(GameEvent.NewGame, () => {
            loadNewGame(this.ecs, this);
            initDisplay(this);
            initSystems(this);
            EventBus.emit(GameEvent.ViewsInitialized);
        });

        EventBus.on(GameEvent.LoadGame, (state: GameState) => {
            loadFromState(this.ecs, state);
            initDisplay(this);
            initSystems(this);
            EventBus.emit(GameEvent.ViewsInitialized);
        });

        this.events.on('destroy', this.destroy);
    }

    private destroy() {
        this.events.off('destroy', this.destroy);

        this.destroyQueue.forEach(fn => fn());
        this.destroyQueue = [];
        
        this.gameDisplay.destroy();

        EventBus.off(GameEvent.SetTimeSpeed);
        EventBus.off(GameEvent.SetTime);
        EventBus.off(GameEvent.NewGame);
        EventBus.off(GameEvent.LoadGame);
    }
}
