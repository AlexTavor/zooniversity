import { ECS, Entity } from "../../ECS";
import { Transform } from "../../components/Transform";

export function turnToTarget(
    ecs: ECS,
    entity: Entity,
    targetEntity: Entity,
): void {
    const transform = ecs.getComponent(entity, Transform);
    const targetTransform = ecs.getComponent(targetEntity, Transform);

    if (transform && targetTransform) {
        const deltaX = targetTransform.x - transform.x;
        transform.direction = deltaX > 0 ? -1 : 1; // Assuming -1 is right, 1 is left
    }
}
