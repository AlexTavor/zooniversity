import { ViewTracker } from "./ViewTracker";
import { Transform } from "../../logic/components/Transform.ts";
import { Cave } from "../../logic/components/Cave.ts";
import { createView } from "../setup/ViewStore.ts";
import { SpriteKey } from "../setup/SpriteLibrary.ts";
import { GameDisplayContext } from "../GameDisplay.ts";

export function createCaveViewTracker(
    context: GameDisplayContext
): ViewTracker {
    return new ViewTracker({
        ecs: context.ecs,
        scene: context.scene,
        componentClasses: [Transform, Cave],
        layerContainer: context.layers.Caves,
        createDefinition: (ecs, entity) => {
            const transform = ecs.getComponent(entity, Transform);
            return createView({
                spriteName: "cave" as SpriteKey,
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
            // frame is static for caves; update here if it ever changes:
            // view.sprite?.setFrame(viewDefinition.frame);
            return false;
        }
    });
}
