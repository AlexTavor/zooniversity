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
import {SkyDisplayModule} from "../display/game/sky/SkyDisplayModule.ts";
import {TimeSystem} from "../logic/time/TimeSystem.ts";
import {InputSystem} from "../logic/input/InputSystem.ts";
import {createTreeViewTracker} from "../display/game/createTreeViewTracker.ts";
import {createCaveViewTracker} from "../display/game/createCaveViewTracker.ts";
import {StarfieldModule} from "../display/game/sky/StarfieldModule.ts";
import {CloudsModule} from "../display/game/sky/CloudsModule.ts";
import {WeatherSystem} from "../logic/weather/WeatherSystem.ts";
import {TimeTintPipeline} from "../../render/pipelines/TimeTintPipeline.ts";
import {TinterModule} from "../display/game/time_tint/TinterModule.ts";
import {TreeSwayModule} from "../display/game/trees/TreeSwayModule.ts";

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
        
        this.ecs?.update(delta);
        this.gameDisplay?.update(delta);
    }
    
    create ()
    {
        EventBus.emit('current-scene-ready', this);
        setSceneType('game');

        const pipeline = new TimeTintPipeline(this.game);

        // Register it
        (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer)
            .pipelines
            .add('TimeTint', pipeline);

        // Apply to main camera
        // this.cameras.main.setPostPipeline('TimeTint');
        
        this.ecs = new ECS();
        
        const initDisplay = ()=>{
            
            this.gameDisplay = new GameDisplay();

            
            const modules = [
                new CameraModule(),
                new SkyDisplayModule(),
                new StarfieldModule(),
                new CloudsModule(),
                new TinterModule(),
                new TreeSwayModule()
            ];
            
            this.gameDisplay.init(this, this.ecs, modules,
            [
                (display:GameDisplay)=>createTreeViewTracker(display),
                (display:GameDisplay)=>createCaveViewTracker(display)
            ]);
        }
        
        const initSystems = ()=>{
            this.ecs.addSystem(new TimeSystem());
            this.ecs.addSystem(new InputSystem());
            this.ecs.addSystem(new WeatherSystem());
        }
        
        EventBus.on(GameEvent.NewGame, () => {
            loadNewGame(this.ecs, this);
            initDisplay();
            initSystems();
        });

        EventBus.on(GameEvent.LoadGame, (state: GameState) => {
            loadFromState(this.ecs, state);
            initDisplay();
            initSystems();
        });
    }
}
