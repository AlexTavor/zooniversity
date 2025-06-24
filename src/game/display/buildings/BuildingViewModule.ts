import Phaser from "phaser";
import { ECS, Entity } from "../../ECS";
import { Transform } from "../../components/Transform";
import { WoodDojo } from "../../logic/buildings/wood_dojo/WoodDojo";
import { SpriteKey } from "../setup/SpriteLibrary";
import { View } from "../setup/View";
import {
    ViewDefinition,
    ViewType,
    PanelDefinition,
} from "../setup/ViewDefinition";
import {
    ViewDisplayModule,
    registerViewDisplayModule,
} from "../setup/ViewDisplayModule";
import { createView } from "../setup/ViewStore";
import { ToolType } from "../tools/GameTools";
import { GameDisplayContext } from "../GameDisplay";
import { PanelId, PanelRegistry } from "../data_panel/PanelRegistry";

export class BuildingViewModule extends ViewDisplayModule {
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
        return [Transform, WoodDojo];
    }

    getLayerContainer(): Phaser.GameObjects.Container {
        return this.context.layers.Caves;
    }

    createDefinition(ecs: ECS, entity: Entity): ViewDefinition {
        const transform = ecs.getComponent(entity, Transform);

        return createView({
            spriteName: "wood_dojo" as SpriteKey,
            position: {
                x: Math.round(transform.x),
                y: Math.round(transform.y),
            },
            size: { x: 2, y: 2 },
            frame: 0,
            type: ViewType.CAVE,
            panelDefinition: this.createPanelDefinition(),
        });
    }

    private createPanelDefinition(): PanelDefinition {
        const panel =
            PanelRegistry[PanelId.BUILDING_WOOD_DOJO] || new PanelDefinition();
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
            this.context.layers.Surface,
            this.context.scene,
        );
        // view.applyEffect(EffectType.Shader, { shader: "TimeTint" });

        return view;
    }
}
