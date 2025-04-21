import {MapDefinition} from "../../display/editor/map_editor/MapTypes.ts";
import {ECS} from "../../ECS.ts";
import {Transform} from "../components/Transform.ts";
import {Tree} from "../components/Tree.ts";
import {PlantSpriteKey} from "../../display/setup/SpriteLibrary.ts";
import {Cave} from "../components/Cave.ts";
import {EventBus} from "../../EventBus.ts";
import {GameEvent} from "../../consts/GameEvents.ts";
import {createWorldEntity} from "../createWorldEntity.ts";
import {PanelDataComponent} from "../selection/PanelDataComponent.ts";

function loadMapIntoECS(ecs: ECS, map: MapDefinition): void {
    for (const [id, obj] of Object.entries(map.objects)) {
        const entity = ecs.addEntity();

        // Use view position if available, otherwise skip
        if (obj.components?.view) {
            const view = obj.components.view;
            ecs.addComponent(entity, new Transform(view.position.x, view.position.y, obj.zHint ?? 0));
        }

        const def = obj.components?.view;
        
        if (!def) {
            console.warn(`Object ${id} is missing a view component.`);
            continue;
        }
        
        switch (obj.type) {
            case "tree":
                if (def.spriteName) {
                    ecs.addComponent(entity, new Tree(def.spriteName as PlantSpriteKey));
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

        const panelDef = def.panelDefinition;
        
        if (!panelDef) {
            continue;
        }
        
        ecs.addComponent(entity, new PanelDataComponent({...panelDef, entity}));
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
