import { ViewTracker } from "./ViewTracker";
import {Transform} from "../../logic/components/Transform.ts";
import {Cave} from "../../logic/components/Cave.ts";
import {createView} from "../setup/ViewStore.ts";
import {SpriteKey} from "../setup/SpriteLibrary.ts";
import {GameDisplayContext} from "../GameDisplay.ts";

export function createCaveViewTracker(
    context: GameDisplayContext,
): ViewTracker {
    return new ViewTracker(
        context.ecs,
        context.layers.Trees,
        context.scene,
        [Transform, Cave],
        (ecs, entity) => {
            const transform = ecs.getComponent(entity, Transform);
            // Cave sprite key is fixed
            return createView({
                spriteName: "cave" as SpriteKey,
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
