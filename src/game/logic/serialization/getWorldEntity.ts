// src/game/logic/world/worldUtils.ts
import { ECS, Entity } from "../../ECS"; // Adjust path as needed

let cachedWorldEntityId: Entity | null | undefined = undefined;

/**
 * Retrieves or creates the single world entity ID.
 * Ensures a consistent entity ID is used for global state components.
 * @param ecs The ECS instance.
 * @returns The world entity ID.
 */
export function getWorldEntity(ecs: ECS): Entity {
    // Check cache first, and validate if the cached entity still exists
    if (
        cachedWorldEntityId !== undefined &&
        cachedWorldEntityId !== null &&
        ecs.hasEntity(cachedWorldEntityId)
    ) {
        return cachedWorldEntityId;
    }

    // If cache is invalid or not set, create a new entity
    const newWorldEntity = ecs.addEntity();
    cachedWorldEntityId = newWorldEntity;
    return newWorldEntity;
}

/**
 * Clears the cached world entity ID.
 */
export function clearCachedWorldEntity(): void {
    cachedWorldEntityId = undefined;
}