import { MapDefinition } from "./MapTypes.ts";
import { ECS } from "../../ECS.ts";
import { Transform } from "../../components/Transform.ts";
import { Tree } from "../trees/Tree.ts";
import {
    CaveSpriteKey,
    PlantSpriteKey,
} from "../../display/setup/SpriteLibrary.ts";
import { Cave } from "../buildings/Cave.ts";
import { EventBus } from "../../EventBus.ts";
import { GameEvent } from "../../consts/GameEvent.ts";
import { ViewDefinition } from "../../display/setup/ViewDefinition.ts";
import { WoodDojo } from "../buildings/wood_dojo/WoodDojo.ts";
import { HarvestableComponent } from "../trees/HarvestableComponent.ts";
import { ResourceType } from "../resources/ResourceType.ts";
import {
    InteractionSlots,
    SlotLayout,
    SlotType,
} from "../../components/InteractionSlots.ts";
import { initWorld, createProfessorBooker } from "./init.ts";
import { DormitoryComponent } from "../buildings/dormitory/DormitoryComponent.ts";
import { InsideLocationComponent } from "../locomotion/InsideLocationComponent.ts";
import { ForagableComponent } from "../foraging/ForagableComponent.ts";

function loadMapIntoECS(ecs: ECS, map: MapDefinition): void {
    for (const [id, obj] of Object.entries(map.objects)) {
        const entity = ecs.addEntity();

        // Use view position if available, otherwise skip
        if (obj.components?.view) {
            const view = obj.components.view;
            ecs.addComponent(
                entity,
                new Transform(view.position.x, view.position.y),
            );
        }

        const def = obj.components?.view;

        if (!def) {
            console.warn(`Object ${id} is missing a view component.`);
            continue;
        }

        switch (obj.type) {
            case "tree":
                if (def.spriteName) {
                    ecs.addComponent(
                        entity,
                        new Tree(def.spriteName as PlantSpriteKey),
                    );
                    ecs.addComponent(
                        entity,
                        new HarvestableComponent(1000, [
                            { type: ResourceType.WOOD, amount: 10 },
                        ]),
                    );
                    if (def.spriteName.startsWith("bush")) {
                        ecs.addComponent(
                            entity,
                            new ForagableComponent(
                                ResourceType.FOOD,
                                20,
                                20,
                                0.001,
                            ),
                        );
                    }
                    ecs.addComponent(
                        entity,
                        new InteractionSlots({
                            [SlotType.WORK]: {
                                layout: SlotLayout.RADIAL,
                                radius: 120,
                                count: 2,
                            },
                            [SlotType.FORAGE]: {
                                layout: SlotLayout.RADIAL,
                                radius: 120,
                                count: 4,
                            },
                        }),
                    );
                } else {
                    console.warn(`Tree object ${id} is missing a sprite key.`);
                }
                break;
            case "cave":
                if (def.spriteName) {
                    createCave(def, ecs, entity);
                } else {
                    console.warn(`Cave object ${id} is missing a sprite key.`);
                }
                break;

            default:
                console.warn(`Unknown object type: ${obj.type}`);
                break;
        }

        const panelDef = def.panelDefinition;

        if (!panelDef) {
            continue;
        }
    }
}

function createCave(def: ViewDefinition, ecs: ECS, entity: number) {
    switch (def.spriteName as CaveSpriteKey) {
        case "cave":
            ecs.addComponent(entity, new InsideLocationComponent());
            ecs.addComponent(entity, new Cave(false));
            break;
        case "wood_dojo":
            ecs.addComponent(entity, new InsideLocationComponent());
            ecs.addComponent(entity, new WoodDojo());
            ecs.addComponent(entity, new DormitoryComponent());
            ecs.addComponent(
                entity,
                new InteractionSlots({
                    [SlotType.SLEEP]: {
                        layout: SlotLayout.RADIAL,
                        radius: 100,
                        count: 5,
                    },
                }),
            );
            break;
        default:
            console.warn(`Unknown cave sprite key: ${def.spriteName}`);
            break;
    }
}

// =============================
// Game Entry: Load New Game
// =============================
export function loadNewGame(ecs: ECS, scene: Phaser.Scene): void {
    const rawData = scene.cache.json.get("forestMap");
    if (!rawData) {
        console.error("Failed to load forestMap from cache.");
        return;
    }

    const mapDefinition = rawData as MapDefinition;
    loadMapIntoECS(ecs, mapDefinition);
    initWorld(ecs);
    createProfessorBooker(ecs);
    createProfessorBooker(ecs);
    createProfessorBooker(ecs);
    createProfessorBooker(ecs);
    EventBus.emit(GameEvent.GameLoaded);
}
