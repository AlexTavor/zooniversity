import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { ECS } from "../ECS.ts";
import { GameDisplay } from "../display/GameDisplay.ts";
import { setSceneType } from "../../ui/ui_switcher/useActiveSceneType.ts";
import { GameEvent } from "../consts/GameEvent.ts";
import { GameState } from "../logic/serialization/GameState.ts";
import { loadFromState } from "../logic/serialization/GameStateSerializer.ts";
import { loadNewGame } from "../logic/serialization/MapSerializer.ts";
import { TimeTintPipeline } from "../../render/pipelines/TimeTintPipeline.ts";
import { init } from "../logic/serialization/init.ts";
import { OutlineOnlyPipeline } from "../../render/pipelines/OutlinePipelineSingle.ts";
import { GameUIEvent } from "../consts/UIEvent.ts";

export class Game extends Scene {
    gameDisplay: GameDisplay;
    ecs: ECS;

    destroyQueue: Array<() => void> = [];

    constructor() {
        super("Game");
    }

    update(time: number, delta: number) {
        super.update(time, delta);

        this.ecs?.update(delta);
        this.gameDisplay?.update(delta);
    }

    create() {
        EventBus.emit("current-scene-ready", this);
        setSceneType("game");

        this.SetupShaders();

        this.ecs = new ECS();

        EventBus.on(GameEvent.NewGame, () => {
            loadNewGame(this.ecs, this);
            init(this);
        });

        EventBus.on(GameEvent.LoadGame, (state: GameState) => {
            loadFromState(this.ecs, state);
            init(this);
        });

        this.destroyQueue.push(this.registerForResize());

        this.events.on("destroy", this.destroy);
    }

    private SetupShaders() {
        const renderer = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;

        renderer.pipelines.add("TimeTint", new TimeTintPipeline(this.game));

        const outlinePipeline = new OutlineOnlyPipeline(this.game);
        renderer.pipelines.add("outlineOnly", outlinePipeline);
    }

    private registerForResize(): () => void {
        /**
         * Handles the resize event by emitting the canvas bounds.
         */
        const handleResize = () => {
            const bounds = this.scale.canvasBounds;
            if (bounds) {
                // Emit a plain object to avoid potential issues with Phaser's Rectangle object
                EventBus.emit(GameUIEvent.CANVAS_RESIZED_EVENT, {
                    x: bounds.x,
                    y: bounds.y,
                    width: bounds.width,
                    height: bounds.height,
                });
            }
        };

        // Subscribe to the scale manager's resize event
        this.scale.on("resize", handleResize);

        // Emit the initial bounds immediately in case the UI is ready before a resize occurs
        handleResize();

        // Return a cleanup function to be called when the scene is destroyed
        const cleanup = () => {
            this.scale.off("resize", handleResize);
        };

        return cleanup;
    }

    private destroy() {
        this.events.off("destroy", this.destroy);

        this.destroyQueue.forEach((fn) => fn());
        this.destroyQueue = [];

        this.gameDisplay.destroy();

        EventBus.off(GameEvent.SetTimeSpeed);
        EventBus.off(GameEvent.SetTime);
        EventBus.off(GameEvent.NewGame);
        EventBus.off(GameEvent.LoadGame);
    }
}
