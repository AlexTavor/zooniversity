import { ViewTracker } from "./ViewTracker.ts";
import { Transform } from "../../logic/components/Transform.ts";
import { Tree } from "../../logic/components/Tree.ts";
import { createView } from "../setup/ViewStore.ts";
import { GameDisplayContext } from "../GameDisplay.ts";
import {ViewType} from "../setup/ViewDefinition.ts";
import { View } from "../setup/View.ts";

export function createTreeCutIconViewTracker(
    context: GameDisplayContext
): ViewTracker {
    return new ViewTracker({
        viewsByEntity: context.iconsByEntity,
        ecs: context.ecs,
        scene: context.scene,
        componentClasses: [Transform, Tree],
        layerContainer: context.layers.Icons,
        createDefinition: (ecs, entity) => {
            const transform = ecs.getComponent(entity, Transform);

            return createView({
                spriteName: "axe_icon",
                position: {
                    x: Math.round(transform.x),
                    y: Math.round(transform.y),
                },
                frame: 0,
                type: ViewType.ICON,
                size:{x:0.25, y:0.25}
            });
        },
        updateView: (ecs, entity, view) => {
            const transform = ecs.getComponent(entity, Transform);

            view.viewContainer.x = Math.round(transform.x);
            view.viewContainer.y = Math.round(transform.y);

            const tree = ecs.getComponent(entity, Tree);
            view.sprite.visible = tree.selectedForCutting;

            return false;
        },
        createView: (id, views, viewDefinition) => {
            const view = new View(id, views, viewDefinition, context.layers.Icons, context.scene, "");
            view.sprite.tint = 0xff0000;
            return view;
        },
    });
}
