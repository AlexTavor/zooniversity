import {DisplayModule} from "./setup/DisplayModule.ts";
import {ECS} from "../ECS.ts";
import {EventBus, UiEvents} from "../EventBus.ts";
import {GroundDisplayModule} from "./ground/GroundDisplayModule.ts";
import {Layers} from "./setup/Layers.ts";
import {PlantsDisplayModule} from "./plants/PlantsDisplayModule.ts";
import {CameraModule} from "./camera/CameraModule.ts";

export type GameDisplayModule = DisplayModule<GameDisplay>;

export class GameDisplay {
    modules: GameDisplayModule[];
    scene: Phaser.Scene;
    ecs: ECS;
    layers: Layers;
    
    constructor(scene: Phaser.Scene, ecs:ECS) {
        this.scene = scene;
        this.ecs = ecs;
        this.layers = new Layers(scene);
        this.modules = [
            new GroundDisplayModule(),
            new PlantsDisplayModule(),
            new CameraModule()
        ];

        for (const module of this.modules) {
            module.init(this);
        }
    }

    public destroy() {
        this.modules.forEach(module => module.destroy());
    }
    
    public update(delta: number) {
        this.modules.forEach(module => module.update(delta));

        EventBus.emit(UiEvents.GameUpdate, this);
    }
}