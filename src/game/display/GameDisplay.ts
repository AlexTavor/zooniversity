import { DisplayModule } from "./setup/DisplayModule.ts";
import {ECS, Entity} from "../ECS.ts";
import { Layers } from "./setup/Layers.ts";
import {ViewTracker} from "./game/ViewTracker.ts";
import {Config} from "../config/Config.ts";
import {createView} from "./setup/ViewStore.ts";
import {View} from "./setup/View.ts";

export interface GameDisplayContext {
    scene: Phaser.Scene;
    layers: Layers;
    ecs: ECS;
    viewsByEntity: Map<Entity, View>;
}

export type GameDisplayModule = DisplayModule<GameDisplayContext>;

export class GameDisplay implements GameDisplayContext {
    modules: GameDisplayModule[];
    scene: Phaser.Scene;
    ecs: ECS;
    layers: Layers;
    hill: View;
    private trackers: ViewTracker[];
    viewsByEntity = new Map();

    init(
        scene: Phaser.Scene, 
        ecs: ECS, modules: GameDisplayModule[], 
        trackers?: Array<(context: GameDisplay)=>ViewTracker>) {
        this.scene = scene;
        this.ecs = ecs;
        this.layers = new Layers(scene);
        this.modules = modules;
        
        for (const module of this.modules) {
            module.init(this);
        }
        
        this.trackers = trackers?.map(tracker => tracker(this)) ?? [];

        this.setHill();
    }
    
    public setHill(): void {
        const wFactor = Config.AnimImports.StaticWidth / Config.Display.Width;
        const hFactor = Config.AnimImports.StaticHeight / Config.Display.Height;

        const hillSize = {
            x: Config.Display.Width / Config.Display.PixelsPerUnit * wFactor,
            y: Config.Display.Height / Config.Display.PixelsPerUnit * hFactor
        };

        // Why offset?
        const hOffset = 100;
        const wOffset = 100;

        const hillPosition = {
            x: Math.round(Config.GameWidth / 2 + wOffset),
            y: Math.round(Config.GameHeight / 2 + hOffset)
        };


        const hillDef = createView({
            size: hillSize,
            position: hillPosition,
            spriteName: 'hill',
            selectable: false,
        });
        
        this.hill = new View(0, {}, hillDef, this.layers.Ground, this.scene);
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
