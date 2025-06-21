import { ViewTracker } from "./ViewTracker";
import { ECS, Entity } from "../../ECS";
import { View } from "../setup/View";
import { ViewDefinition } from "../setup/ViewDefinition";
import { GameDisplayContext } from "../GameDisplay";
import { DisplayModule } from "./DisplayModule";

export abstract class ViewDisplayModule
    implements DisplayModule<GameDisplayContext>
{
    tracker!: ViewTracker;
    context!: GameDisplayContext;

    abstract getComponentClasses(): Function[];

    abstract createDefinition(ecs: ECS, entity: Entity): ViewDefinition;

    abstract updateView(ecs: ECS, entity: Entity, view: View): boolean;

    abstract createView(
        ecs: ECS,
        entity: Entity,
        views: { [key: number]: ViewDefinition },
        viewDefinition: ViewDefinition,
    ): View;

    abstract getLayerContainer(): Phaser.GameObjects.Container;

    abstract init(context: GameDisplayContext): void;

    abstract update(delta: number): void;

    abstract destroy(): void;

    static getReactCoordsFromPhaser(
        container: Phaser.GameObjects.Container,
        camera: Phaser.Cameras.Scene2D.Camera,
    ): { x: number; y: number } {
        const x = (container.x - camera.worldView.x) * camera.zoom;
        const y = (container.y - camera.worldView.y) * camera.zoom;
        const canvas = camera.scene.sys.game.canvas;
        return {
            x: Phaser.Math.Clamp(x, 0, canvas.width),
            y: Phaser.Math.Clamp(y, 0, canvas.height),
        };
    }
}

export function registerViewDisplayModule(
    module: ViewDisplayModule,
    context: GameDisplayContext,
    viewsByEntity: Map<Entity, View>,
): void {
    module.context = context;
    module.tracker = new ViewTracker({
        viewsByEntity,
        ecs: context.ecs,
        scene: context.scene,
        componentClasses: module.getComponentClasses(),
        layerContainer: module.getLayerContainer(),
        createDefinition: module.createDefinition.bind(module),
        updateView: module.updateView.bind(module),
        createView: module.createView.bind(module),
    });

    module.tracker.init();
    module.tracker.update();
}
