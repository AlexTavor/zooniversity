import { System, Entity } from "../../ECS.ts";
import { LocationState, Transform } from "../../components/Transform.ts";
import { ActionIntentComponent } from "../work/ActionIntentComponent.ts";
import { TimeComponent } from "../time/TimeComponent.ts";
import { LocomotionComponent } from "./LocomotionComponent.ts";
import { InsideLocationComponent } from "./InsideLocationComponent.ts";

export class LocomotionSystem extends System {
  componentsRequired = new Set<Function>([
    LocomotionComponent,
    Transform,
    ActionIntentComponent,
  ]);

  update(entities: Set<Entity>, delta: number): void {
    const worldEntity = this.ecs.getEntitiesWithComponent(TimeComponent)[0];
    if (!worldEntity) return;
    const time = this.ecs.getComponent(worldEntity, TimeComponent);
    if (time.speedFactor === 0) return;
    const scaledDelta = delta * time.speedFactor;

    for (const entity of entities) {
      const locomotion = this.ecs.getComponent(entity, LocomotionComponent);
      const transform = this.ecs.getComponent(entity, Transform);
      const intent = this.ecs.getComponent(entity, ActionIntentComponent);
      const targetId = intent.targetEntityId;

      if (targetId !== -1 && this.ecs.hasEntity(targetId)) {
        const isTargetAnInsideLocation = this.ecs.hasComponent(targetId, InsideLocationComponent);
        const targetTransform = this.ecs.getComponent(targetId, Transform);
        const offset = intent.slotOffset ?? { x: 0, y: 0 };
        const targetX = targetTransform.x + offset.x;
        const targetY = targetTransform.y + offset.y;

        const dx = targetX - transform.x;
        const dy = targetY - transform.y;
        const distSq = dx * dx + dy * dy;

        const currentInteractionRange = intent.range;
        const arrivalThresholdSq = currentInteractionRange * currentInteractionRange;

        if (distSq <= arrivalThresholdSq) {
          locomotion.arrived = true;
        } else {
          locomotion.arrived = false; // Not in range, so not arrived
          // Movement logic
          const dist = Math.sqrt(distSq);
          const step = locomotion.speed * scaledDelta;

          if (dist <= step + currentInteractionRange) { // Will reach interaction boundary this frame
            if (dist > 0) {
              const directionX = dx / dist;
              const directionY = dy / dist;
              transform.x = targetX - directionX * currentInteractionRange;
              transform.y = targetY - directionY * currentInteractionRange;
            } else { // Already at target's origin
              transform.x = targetX;
              transform.y = targetY;
            }
            locomotion.arrived = true; // Now arrived due to movement
          } else { // Normal move
            if (dist > 0) {
              const moveFactor = step / dist;
              transform.x += dx * moveFactor;
              transform.y += dy * moveFactor;
            }
          }
        }

        // Update LocationState based on target type and arrival status
        if (isTargetAnInsideLocation) {
          if (locomotion.arrived) {
            transform.locationState = LocationState.INSIDE;
          } else {
            // En route to an inside location (implies they are currently outside it)
            transform.locationState = LocationState.OUTSIDE;
          }
        } else {
          // Target is not an "inside" location (e.g., a tree, another character outdoors)
          // Regardless of arrival, character is considered OUTSIDE in this context.
          transform.locationState = LocationState.OUTSIDE;
        }
        
        // Update sprite direction
        if (dx !== 0 || dy !== 0) {
            transform.direction = dx > 0 ? -1 : (dx < 0 ? 1 : transform.direction);
        }

      } else { // No valid target (targetId is -1 or target entity doesn't exist)
        locomotion.arrived = false; 
        if (transform.locationState === LocationState.INSIDE) {
          // If previously INSIDE and now has no target (e.g., action finished/changed by ScheduleSystem),
          // they are now considered OUTSIDE.
          transform.locationState = LocationState.OUTSIDE;
        }
        // If already OUTSIDE or AWAY, and no target, state remains. 'AWAY' to be handled by other systems.
      }
    }
  }
}