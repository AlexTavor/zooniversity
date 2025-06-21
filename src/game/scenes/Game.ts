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
import { init} from '../logic/serialization/init.ts';
import { OutlineOnlyPipeline } from '../../render/pipelines/OutlinePipelineSingle.ts';

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

        this.SetupShaders();
  
        this.ecs = new ECS();
        
        EventBus.on(GameEvent.NewGame, () => {
            loadNewGame(this.ecs, this);
            init(this)
        });

        EventBus.on(GameEvent.LoadGame, (state: GameState) => {
            loadFromState(this.ecs, state);
            init(this)
        });

        this.events.on('destroy', this.destroy);
    }

    private SetupShaders() {
        const renderer = (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer);

        renderer.pipelines
            .add('TimeTint', new TimeTintPipeline(this.game));

        const outlinePipeline = new OutlineOnlyPipeline(this.game);
        renderer
            .pipelines
            .add('outlineOnly', outlinePipeline);
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
