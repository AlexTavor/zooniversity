import {DisplayModule} from "./setup/DisplayModule.ts";
import {ECS} from "../ECS.ts";
import {EventBus, UiEvents} from "../EventBus.ts";
import {Layers} from "./setup/Layers.ts";

export type GameDisplayModule = DisplayModule<GameDisplay>;

export class GameDisplay {
    modules: GameDisplayModule[];
    scene: Phaser.Scene;
    ecs: ECS;
    layers: Layers;
    
    constructor(scene: Phaser.Scene, ecs:ECS, modules: GameDisplayModule[]) {
        this.scene = scene;
        this.ecs = ecs;
        this.layers = new Layers(scene);
        this.modules = modules;

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