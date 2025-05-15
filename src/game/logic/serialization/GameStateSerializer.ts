
// Registry to map component names to classes for deserialization
import {Component, ECS} from "../../ECS.ts";
import {Transform} from "../../components/Transform.ts";
import {Tree} from "../trees/Tree.ts";
import {Cave} from "../buildings/Cave.ts";
import {EntityState, GameState} from "./GameState.ts";
import {EventBus} from "../../EventBus.ts";
import {GameEvent} from "../../consts/GameEvent.ts";
import {InputComponent} from "../input/InputComponent.ts";
import {TimeComponent} from "../time/TimeComponent.ts";

const componentRegistry: Record<string, new (...args: any[]) => Component> = {
    Transform,
    Tree,
    Cave,
    InputComponent,
    TimeComponent
};

export function serializeECS(ecs: ECS): GameState {
    const entities: EntityState[] = [];

    for (const [entityId, container] of ecs["entities"].entries()) {
        const components: Record<string, any> = {};
        for (const [key, component] of container["map"].entries()) {
            components[key.name] = { ...component }; // assumes components are plain data
        }
        entities.push({ id: entityId, components });
    }

    return { entities };
}

export function loadFromState(ecs: ECS, state: GameState): void {
    // Sort by entity ID to ensure ECS assigns them in matching order
    state.entities.sort((a, b) => a.id - b.id);
    for (const entityState of state.entities) {
        const entity = ecs.addEntity(); // creates a new ID, ignores the original one
        for (const [name, data] of Object.entries(entityState.components)) {
            const CompClass = componentRegistry[name];
            if (!CompClass) {
                console.warn(`Unknown component type: ${name}`);
                continue;
            }
            const instance = Object.assign(new CompClass(), data);
            ecs.addComponent(entity, instance);
        }
    }
    EventBus.emit(GameEvent.GameLoaded);
}
