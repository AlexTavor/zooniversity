import Phaser from "phaser";
import { ECS, Entity } from "../../ECS";
import { Transform } from "../../components/Transform";
import { Tree } from "../../logic/trees/Tree";
import { GameDisplayContext } from "../GameDisplay";
import { View } from "../setup/View";
import { ViewDefinition, ViewType } from "../setup/ViewDefinition";
import {
    ViewDisplayModule,
    registerViewDisplayModule,
} from "../setup/ViewDisplayModule";
import { EffectType } from "../setup/ViewEffectController";
import { createView } from "../setup/ViewStore";

const MIN_EFFECTIVE_SCALE = 0.3; // The minimum apparent size on screen.
const MAX_EFFECTIVE_SCALE = 1; // The maximum apparent size on screen.

export class TreeCutIconViewModule extends ViewDisplayModule {
    init(context: GameDisplayContext): void {
        registerViewDisplayModule(this, context, context.iconsByEntity);
    }

    update(_delta: number): void {
        this.tracker?.update();
    }

    destroy(): void {
        this.tracker?.destroy();
    }

    getComponentClasses(): Function[] {
        return [Transform, Tree];
    }

    getLayerContainer(): Phaser.GameObjects.Container {
        return this.context.layers.Icons;
    }

    getViewsByEntityMap(context: GameDisplayContext) {
        return context.iconsByEntity;
    }

    createDefinition(ecs: ECS, entity: Entity): ViewDefinition {
        const transform = ecs.getComponent(entity, Transform);

        return createView({
            spriteName: "axe_icon",
            position: {
                x: Math.round(transform.x),
                y: Math.round(transform.y),
            },
            frame: 0,
            type: ViewType.ICON,
            size: { x: 0.25, y: 0.25 },
        });
    }

    updateView(ecs: ECS, entity: Entity, view: View): boolean {
        const transform = ecs.getComponent(entity, Transform);
        const tree = ecs.getComponent(entity, Tree);

        view.viewContainer.x = Math.round(transform.x);
        view.viewContainer.y = Math.round(transform.y);

        const camera = this.context.scene.cameras.main;

        // Clamp the desired final scale of the icon.
        const desiredScale = Phaser.Math.Clamp(
            camera.zoom,
            MIN_EFFECTIVE_SCALE,
            MAX_EFFECTIVE_SCALE,
        );

        // Calculate the local scale needed to achieve the desiredScale,
        // by counteracting the parent container's scale (which is camera.zoom).
        const localScale = desiredScale / camera.zoom;

        view.viewContainer.setScale(localScale);

        const sprite = view.getSprite();
        if (sprite) {
            sprite.setInteractive(false);
            sprite.visible = tree.selectedForCutting;
        }

        return false;
    }

    createView(
        _ecs: ECS,
        _entity: number,
        views: { [key: number]: ViewDefinition },
        viewDefinition: ViewDefinition,
    ): View {
        const view = new View(
            viewDefinition.id,
            views,
            viewDefinition,
            this.context.layers.Icons,
            this.context.scene,
        );
        view.applyEffect(EffectType.Red);
        return view;
    }
}
