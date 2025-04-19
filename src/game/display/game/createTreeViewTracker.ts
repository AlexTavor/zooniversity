import { ViewTracker } from "./ViewTracker";
import { Transform } from "../../logic/components/Transform.ts";
import { Tree } from "../../logic/components/Tree.ts";
import { createView } from "../setup/ViewStore.ts";
import { SpriteKey } from "../setup/SpriteLibrary.ts";
import { GameDisplayContext } from "../GameDisplay.ts";

export function createTreeViewTracker(
    context: GameDisplayContext
): ViewTracker {
    return new ViewTracker({
        ecs: context.ecs,
        scene: context.scene,
        componentClasses: [Transform, Tree],
        layerContainer: context.layers.Trees,
        createDefinition: (ecs, entity) => {
            const transform = ecs.getComponent(entity, Transform);
            const tree = ecs.getComponent(entity, Tree);

            return createView({
                spriteName: tree.kind as SpriteKey,
                position: {
                    x: Math.round(transform.x),
                    y: Math.round(transform.y),
                },
                frame: 0,
            });
        },
        updateView: (ecs, entity, view) => {
            const transform = ecs.getComponent(entity, Transform);

            view.viewContainer.x = Math.round(transform.x);
            view.viewContainer.y = Math.round(transform.y);
            // keep frame in sync (if it ever changes)
            view.sprite?.setFrame(view.viewDefinition.frame);
            
            return false;
        }
    });
}
