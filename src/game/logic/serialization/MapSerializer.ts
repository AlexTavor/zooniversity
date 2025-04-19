import {MapDefinition} from "../../display/editor/map_editor/MapTypes.ts";
import {ECS} from "../../ECS.ts";
import {Transform} from "../components/Transform.ts";
import {Tree} from "../components/Tree.ts";
import {PlantSpriteKey} from "../../display/setup/SpriteLibrary.ts";
import {Cave} from "../components/Cave.ts";
import {EventBus} from "../../EventBus.ts";
import {GameEvent} from "../../consts/GameEvents.ts";
import {createWorldEntity} from "../createWorldEntity.ts";

function loadMapIntoECS(ecs: ECS, map: MapDefinition): void {
    for (const [id, obj] of Object.entries(map.objects)) {
        const entity = ecs.addEntity();

        // Use view position if available, otherwise skip
        if (obj.components?.view) {
            const view = obj.components.view;
            ecs.addComponent(entity, new Transform(view.position.x, view.position.y, obj.zHint ?? 0));
        }

        switch (obj.type) {
            case "tree":
                if (obj.components?.view?.spriteName) {
                    ecs.addComponent(entity, new Tree(obj.components.view.spriteName as PlantSpriteKey));
                } else {
                    console.warn(`Tree object ${id} is missing a sprite key.`);
                }
                break;

            case "cave":
                ecs.addComponent(entity, new Cave(false));
                break;

            default:
                console.warn(`Unknown object type: ${obj.type}`);
                break;
        }
    }
}

// =============================
// Game Entry: Load New Game
// =============================
export function loadNewGame(ecs: ECS, scene: Phaser.Scene): void {
    const rawData = scene.cache.json.get('forestMap');
    if (!rawData) {
        console.error('Failed to load forestMap from cache.');
        return;
    }

    const mapDefinition = rawData as MapDefinition;
    loadMapIntoECS(ecs, mapDefinition);
    createWorldEntity(ecs);
    EventBus.emit(GameEvent.GameLoaded);
} 
