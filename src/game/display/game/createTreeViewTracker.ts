import { ViewTracker } from "./ViewTracker";
import { Transform } from "../../logic/components/Transform.ts";
import { Tree } from "../../logic/components/Tree.ts";
import { createView } from "../setup/ViewStore.ts";
import { GameDisplayContext } from "../GameDisplay.ts";
import {ViewType} from "../setup/ViewDefinition.ts";
import { Config } from "../../config/Config.ts";
import { Harvestable } from "../../logic/work/Harvestable.ts";


// TODO - trees fruit display

export function createTreeViewTracker(
    context: GameDisplayContext
): ViewTracker {
    return new ViewTracker({
        viewsByEntity: context.viewsByEntity,
        ecs: context.ecs,
        scene: context.scene,
        componentClasses: [Transform, Tree, Harvestable],
        layerContainer: context.layers.Surface,
        createDefinition: (ecs, entity) => {
            const transform = ecs.getComponent(entity, Transform);
            const tree = ecs.getComponent(entity, Tree);

            return createView({
                spriteName: tree.type,
                position: {
                    x: Math.round(transform.x),
                    y: Math.round(transform.y),
                },
                frame: 0,
                type: ViewType.TREE
            });
        },
        updateView: (ecs, entity, view) => {
            const transform = ecs.getComponent(entity, Transform);

            view.viewContainer.x = Math.round(transform.x);
            // That is an artifact of old creation tools output
            view.viewContainer.y = Math.round(transform.y + Config.AnimImports.FrameHeight/2);
            // keep frame in sync (if it ever changes)
            view.sprite?.setFrame(view.viewDefinition.frame);
            
            const harvestable = ecs.getComponent(entity, Harvestable);
            const harvested = harvestable.harvested;

            view.viewContainer.scaleY = harvested ? 0 : 1;

            return false;
        }
    });
}
