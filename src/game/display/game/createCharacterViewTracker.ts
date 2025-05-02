import { ViewTracker } from "./ViewTracker.ts";
import { Transform } from "../../logic/components/Transform.ts";
import { createView } from "../setup/ViewStore.ts";
import { GameDisplayContext } from "../GameDisplay.ts";
import {PanelDefinition, ViewType} from "../setup/ViewDefinition.ts";
import { Character, CharacterType } from "../../logic/components/Character.ts";
import { EventBus } from "../../EventBus.ts";
import { GameEvent } from "../../consts/GameEvent.ts";


export function createCharacterViewTracker(
    context: GameDisplayContext
): ViewTracker {
    return new ViewTracker({
        viewsByEntity: context.viewsByEntity,
        ecs: context.ecs,
        scene: context.scene,
        componentClasses: [Transform, Character],
        layerContainer: context.layers.Surface,
        createDefinition: (ecs, entity) => {
            const transform = ecs.getComponent(entity, Transform);
            // const character = ecs.getComponent(entity, Character);

            const panelDef = {
                title: "Professor Booker",
                description: "The kind, wise, absent-minded founder of Zooniversity.",
                imagePath: "assets/characters/booker/booker_panel.png"
            };

            return createView({
                spriteName: "booker_char",
                position: {
                    x: Math.round(transform.x),
                    y: Math.round(transform.y),
                },
                frame: 0,
                type: ViewType.CHARCTER,
                panelDefinition: {...(new PanelDefinition()), ...panelDef},
            });
        },
        updateView: (ecs, entity, view) => {
            const transform = ecs.getComponent(entity, Transform);
            const rx = Math.round(transform.x);
            const ry = Math.round(transform.y);
            const isChanged = view.viewContainer.x !== rx || view.viewContainer.y !== ry;

            view.viewContainer.x = rx;
            view.viewContainer.y = ry;
            view.sprite?.setFrame(view.viewDefinition.frame);

            const updateData = {
                id:entity,
                pos:ViewTracker.getReactCoordsFromPhaser(view.viewContainer, context.scene.cameras.main),
                character:{
                    icon:"assets/characters/booker/booker_icon.png",
                    type: CharacterType.PROFESSOR
                }
            }

            EventBus.emit(GameEvent.CharacterUpdate, updateData);
            
            return isChanged;
        }
    });
}
