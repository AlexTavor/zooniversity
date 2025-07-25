import Phaser from "phaser";
import { ECS, Entity } from "../../ECS";
import { EventBus } from "../../EventBus";
import { GameEvent } from "../../consts/GameEvent";
import { Character, CharacterType } from "../../logic/characters/Character";
import { LocationState, Transform } from "../../components/Transform";
import { View } from "../setup/View";
import {
    ViewDefinition,
    PanelDefinition,
    ViewType,
} from "../setup/ViewDefinition";
import {
    ViewDisplayModule,
    registerViewDisplayModule,
} from "../setup/ViewDisplayModule";
import { createView } from "../setup/ViewStore";
import { ViewTracker } from "../setup/ViewTracker";
import { GameDisplayContext } from "../GameDisplay";
import { ActionIntentComponent } from "../../logic/intent/intent-to-action/ActionIntentComponent";
import { CharacterAction } from "../../logic/intent/intent-to-action/actionIntentData";
import { EffectType } from "../setup/ViewEffectController";
import { PanelId, PanelRegistry } from "../data_panel/PanelRegistry";
import { CharacterKeys, SpriteLibrary } from "../setup/SpriteLibrary";

export class CharacterViewModule extends ViewDisplayModule {
    // Changed to a Map to hold a separate action reference for each entity.
    private actionRefs = new Map<Entity, { action: CharacterAction }>();

    init(context: GameDisplayContext): void {
        registerViewDisplayModule(this, context, context.viewsByEntity);
    }

    update(_delta: number): void {
        this.tracker?.update();
    }

    destroy(): void {
        this.tracker?.destroy();
        // Clear the map on destroy to prevent potential memory leaks.
        this.actionRefs.clear();
    }

    getComponentClasses(): Function[] {
        return [Transform, Character];
    }

    getLayerContainer(): Phaser.GameObjects.Container {
        return this.context.layers.Surface;
    }

    createDefinition(ecs: ECS, entity: Entity): ViewDefinition {
        const transform = ecs.getComponent(entity, Transform);

        return createView({
            atlasName: "booker_char",
            position: {
                x: Math.round(transform.x),
                y: Math.round(transform.y),
            },
            frame: 0,
            type: ViewType.CHARCTER,
            panelDefinition: this.createPanelDefinition(),
            selectable: true,
            size: SpriteLibrary[CharacterKeys[0]].defaultSize,
        });
    }

    private createPanelDefinition(): PanelDefinition {
        const panel =
            PanelRegistry[PanelId.CHAR_BOOKER] || new PanelDefinition();
        return panel;
    }

    updateView(ecs: ECS, entity: Entity, view: View): boolean {
        const transform = ecs.getComponent(entity, Transform);
        const rx = Math.round(transform.x);
        const ry = Math.round(transform.y);
        view.viewContainer.visible =
            transform.locationState != LocationState.INSIDE;
        const isChanged =
            view.viewContainer.x !== rx || view.viewContainer.y !== ry;

        view.viewContainer.x = rx;
        view.viewContainer.y = ry;
        view.sprite.scaleX = view.viewDefinition.size.x * transform.direction;

        const action =
            ecs.getComponent(entity, ActionIntentComponent)
                ?.currentPerformedAction ?? CharacterAction.NONE;

        const updateData = {
            id: entity,
            pos: ViewTracker.getReactCoordsFromPhaser(
                view.viewContainer,
                this.context.scene.cameras.main,
            ),
            character: {
                icon: "assets/characters/booker/booker_icon.png",
                type: CharacterType.PROFESSOR,
            },
            currentAction: action,
            visible: !view.viewContainer.visible,
        };

        EventBus.emit(GameEvent.CharacterUpdate, updateData);

        // Get or create the actionRef for this specific entity.
        let actionRef = this.actionRefs.get(entity);
        if (!actionRef) {
            actionRef = { action: CharacterAction.NONE };
            this.actionRefs.set(entity, actionRef);
        }
        // Update the action property of the reference object.
        actionRef.action = action;

        return isChanged;
    }

    createView(
        _ecs: ECS,
        entity: number,
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

        // Get or create the actionRef for this entity to pass to the effect.
        let actionRef = this.actionRefs.get(entity);
        if (!actionRef) {
            actionRef = { action: CharacterAction.NONE };
            this.actionRefs.set(entity, actionRef);
        }

        view.applyEffect(EffectType.ActionEffect, {
            container: this.context.layers.Icons,
            currentActionRef: actionRef,
        });

        view.applyEffect(EffectType.SelectionForeground, {
            container: this.context.layers.Icons,
        });

        return view;
    }
}

