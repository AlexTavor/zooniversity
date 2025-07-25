import { ECS, Entity } from "../../ECS";
import { Cave } from "../../logic/buildings/Cave";
import { Transform } from "../../components/Transform";
import { GameDisplayContext } from "../GameDisplay";
import { SpriteKey } from "../setup/SpriteLibrary";
import { View } from "../setup/View";
import {
    PanelDefinition,
    ViewDefinition,
    ViewType,
} from "../setup/ViewDefinition";
import {
    ViewDisplayModule,
    registerViewDisplayModule,
} from "../setup/ViewDisplayModule";
import { createView } from "../setup/ViewStore";
import { PanelRegistry, PanelId } from "../data_panel/PanelRegistry";

export class CaveViewModule extends ViewDisplayModule {
    init(context: GameDisplayContext): void {
        registerViewDisplayModule(this, context, context.viewsByEntity);
    }

    update(_: number): void {
        this.tracker?.update();
    }

    destroy(): void {
        this.tracker?.destroy();
    }

    getComponentClasses(): Function[] {
        return [Transform, Cave];
    }

    getLayerContainer(): Phaser.GameObjects.Container {
        return this.context.layers.Caves;
    }

    createDefinition(ecs: ECS, entity: Entity): ViewDefinition {
        const transform = ecs.getComponent(entity, Transform);

        return createView({
            spriteName: "cave" as SpriteKey,
            position: {
                x: Math.round(transform.x),
                y: Math.round(transform.y),
            },
            frame: 0,
            type: ViewType.CAVE,
            panelDefinition: this.createPanelDefinition(),
        });
    }

    private createPanelDefinition(): PanelDefinition {
        const panel =
            PanelRegistry[PanelId.CAVE_GENERIC] || new PanelDefinition();
        return panel;
    }

    updateView(ecs: ECS, entity: Entity, view: View): boolean {
        const transform = ecs.getComponent(entity, Transform);
        view.viewContainer.x = Math.round(transform.x);
        view.viewContainer.y = Math.round(transform.y);
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
            this.context.layers.Caves,
            this.context.scene,
        );
        return view;
    }
}
