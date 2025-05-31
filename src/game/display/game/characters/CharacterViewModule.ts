
import Phaser from "phaser";
import { ECS, Entity } from "../../../ECS";
import { EventBus } from "../../../EventBus";
import { GameEvent } from "../../../consts/GameEvent";
import { Character, CharacterType } from "../../../logic/characters/Character";
import { LocationState, Transform } from "../../../components/Transform";
import { View } from "../../setup/View";
import { ViewDefinition, PanelDefinition, ViewType, PanelType } from "../../setup/ViewDefinition";
import { ViewDisplayModule, registerViewDisplayModule } from "../../setup/ViewDisplayModule";
import { EffectType } from "../../setup/ViewEffectController";
import { createView } from "../../setup/ViewStore";
import { ViewTracker } from "../../setup/ViewTracker";
import { GameDisplayContext } from "../../GameDisplay";
import { ActionIntentComponent } from "../../../logic/intent/intent-to-action/ActionIntentComponent";
import { CharacterAction } from "../../../logic/intent/intent-to-action/actionIntentData";

export class CharacterViewModule extends ViewDisplayModule {
    init(context: GameDisplayContext): void {
        registerViewDisplayModule(this, context, context.viewsByEntity);
    }

    update(delta: number): void {
        this.tracker?.update();
    }

    destroy(): void {
        this.tracker?.destroy();
    }
      
    getComponentClasses(): Function[] {
       return [Transform, Character];
    }

    getLayerContainer(): Phaser.GameObjects.Container {
        return this.context.layers.Surface;
    }

    createDefinition(ecs: ECS, entity: Entity): ViewDefinition {
        const transform = ecs.getComponent(entity, Transform);

        const panelDefinition = new PanelDefinition();
        panelDefinition.title = "Professor Booker";
        panelDefinition.description = "The kind, absent-minded founder of Zooniversity.";
        panelDefinition.imagePath = "assets/characters/booker/booker_panel.png";
        panelDefinition.panelType = PanelType.CHARACTER;

        return createView({
            spriteName: "booker_char",
            position: {
                x: Math.round(transform.x),
                y: Math.round(transform.y),
            },
            frame: 0,
            type: ViewType.CHARCTER,
            panelDefinition
        });
    }

    updateView(ecs: ECS, entity: Entity, view: View): boolean {
        const transform = ecs.getComponent(entity, Transform);
        const rx = Math.round(transform.x);
        const ry = Math.round(transform.y);
        view.viewContainer.visible = transform.locationState != LocationState.INSIDE;
        const isChanged = view.viewContainer.x !== rx || view.viewContainer.y !== ry;

        view.viewContainer.x = rx;
        view.viewContainer.y = ry;
        view.viewContainer.scaleX = view.viewDefinition.size.x * transform.direction;

        const action = ecs.getComponent(entity, ActionIntentComponent)?.currentPerformedAction ?? CharacterAction.NONE;

        const updateData = {
            id: entity,
            pos: ViewTracker.getReactCoordsFromPhaser(view.viewContainer, this.context.scene.cameras.main),
            character: {
                icon: "assets/characters/booker/booker_icon.png",
                type: CharacterType.PROFESSOR
            },
            currentAction: action
        };

        EventBus.emit(GameEvent.CharacterUpdate, updateData);

        return isChanged;
    }


    createView(ecs: ECS, entity: number, views: { [key: number]: ViewDefinition; }, viewDefinition: ViewDefinition): View {
        const view = new View(viewDefinition.id, views, viewDefinition, this.context.layers.Surface, this.context.scene);
        view.applyEffect(EffectType.Shader, { shader: "TimeTint" });
        return view;
    }
}
