import { ViewTracker } from "./ViewTracker.ts";
import { Transform } from "../../logic/components/Transform.ts";
import { createView } from "../setup/ViewStore.ts";
import { SpriteKey } from "../setup/SpriteLibrary.ts";
import { GameDisplayContext } from "../GameDisplay.ts";
import {PanelDefinition, ViewType} from "../setup/ViewDefinition.ts";
import { WoodDojo } from "../../logic/components/WoodDojo.ts";

export function createBuildingViewTracker(
    context: GameDisplayContext
): ViewTracker {
    return new ViewTracker({
        viewsByEntity: context.viewsByEntity,
        ecs: context.ecs,
        scene: context.scene,
        componentClasses: [Transform, WoodDojo],
        layerContainer: context.layers.Caves,
        createDefinition: (ecs, entity) => {
            const transform = ecs.getComponent(entity, Transform);
            const panelDefinition = {...(new PanelDefinition()), ...{
                title: "Wood Dojo",
                description: "Center of Wood Mastery",
                imagePath: "assets/panels/wood_dojo_panel.png"
            }};

            return createView({
                spriteName: "wood_dojo" as SpriteKey,
                position: {
                    x: Math.round(transform.x),
                    y: Math.round(transform.y),
                },
                size: {x:2, y:2},
                frame: 0,
                type: ViewType.CAVE,
                panelDefinition
            });
        },
        updateView: (ecs, entity, view) => {
            const transform = ecs.getComponent(entity, Transform);
            view.viewContainer.x = Math.round(transform.x);
            view.viewContainer.y = Math.round(transform.y);
            return false;
        }
    });
}
