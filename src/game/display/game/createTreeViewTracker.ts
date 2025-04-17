import { ViewTracker } from "./ViewTracker";
import {Transform} from "../../logic/components/Transform.ts";
import {Tree} from "../../logic/components/Tree.ts";
import {createView} from "../setup/ViewStore.ts";
import {SpriteKey} from "../setup/SpriteLibrary.ts";
import {GameDisplayContext} from "../GameDisplay.ts";

export function createTreeViewTracker(
    context: GameDisplayContext,
): ViewTracker {
    return new ViewTracker(
        context.ecs,
        context.layers.Caves,
        context.scene,
        [Transform, Tree],
        (ecs, entity) => {
            const transform = ecs.getComponent(entity, Transform);
            const tree = ecs.getComponent(entity, Tree);

            return createView({
                spriteName: tree.kind as SpriteKey,
                position: { x: Math.round(transform.x), y: Math.round(transform.y) },
                frame: 0,
            });
        },
        (_, view, def) => {
            view.viewContainer.x = def.position.x;
            view.viewContainer.y = def.position.y;
            view.sprite?.setFrame(def.frame);
        }
    );
}
