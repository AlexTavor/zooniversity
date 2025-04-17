import { DisplayModule } from "./setup/DisplayModule.ts";
import { ECS } from "../ECS.ts";
import { Layers } from "./setup/Layers.ts";
import {createTreeViewTracker} from "./game/createTreeViewTracker.ts";
import {createCaveViewTracker} from "./game/createCaveViewTracker.ts";
import {ViewTracker} from "./game/ViewTracker.ts";

export interface GameDisplayContext {
    scene: Phaser.Scene;
    layers: Layers;
    ecs: ECS;
}

export type GameDisplayModule = DisplayModule<GameDisplayContext>;

export class GameDisplay implements GameDisplayContext {
    modules: GameDisplayModule[];
    scene: Phaser.Scene;
    ecs: ECS;
    layers: Layers;
    private trackers: ViewTracker[];

    constructor(scene: Phaser.Scene, ecs: ECS, modules: GameDisplayModule[]) {
        this.scene = scene;
        this.ecs = ecs;
        this.layers = new Layers(scene);
        this.modules = modules;
        this.trackers = [];

        for (const module of this.modules) {
            module.init(this);
        }

        this.trackers.push(
            createTreeViewTracker(this),
            createCaveViewTracker(this)
        );
    }

    public destroy() {
        this.modules.forEach(module => module.destroy());
        this.trackers.forEach(tracker => tracker.destroy());
        this.layers.destroy();
    }

    public update(delta: number) {
        this.trackers.forEach(tracker => tracker.update());
        this.modules.forEach(module => module.update(delta));
    }
}
