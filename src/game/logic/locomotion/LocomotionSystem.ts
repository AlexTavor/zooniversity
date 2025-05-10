import { System, Entity } from "../../ECS.ts";
import { Transform } from "../components/Transform.ts";
import { ActionIntentComponent } from "../work/ActionIntentComponent.ts";
import { TimeComponent } from "../time/TimeComponent.ts";
import { Harvester } from "../work/Harvester.ts";
import { LocomotionComponent } from "./LocomotionComponent.ts";

export class LocomotionSystem extends System {
  componentsRequired = new Set<Function>([
    LocomotionComponent,
    Transform,
    ActionIntentComponent,
    Harvester,
  ]);

  update(entities: Set<Entity>, delta: number): void {
    const worldEntity = this.ecs.getEntitiesWithComponent(TimeComponent)[0];
    const time = this.ecs.getComponent(worldEntity, TimeComponent);
    const scaledDelta = delta * time.speedFactor;

    for (const entity of entities) {
      const locomotion = this.ecs.getComponent(entity, LocomotionComponent);
      const transform = this.ecs.getComponent(entity, Transform);
      const intent = this.ecs.getComponent(entity, ActionIntentComponent);
      const harvester = this.ecs.getComponent(entity, Harvester);

      const targetId = intent.targetEntityId;
      if (targetId === -1 || !this.ecs.hasEntity(targetId)) {
        locomotion.arrived = false;
        continue;
      }

      const targetTransform = this.ecs.getComponent(targetId, Transform);
      const offset = intent.slotOffset ?? { x: 0, y: 0 };
      const targetX = targetTransform.x + offset.x;
      const targetY = targetTransform.y + offset.y;

      const dx = targetX - transform.x;
      const dy = targetY - transform.y;

      const distSq = Math.floor(dx * dx + dy * dy);
      const arrivalThresholdSq = Math.floor(harvester.range * harvester.range);

      if (distSq <= arrivalThresholdSq) {
        if (!locomotion.arrived) {
          const dist = Math.sqrt(distSq);
          if (dist > 0 && dist > harvester.range) {
            const clampRatio = harvester.range / dist;
            transform.x = targetX - dx * clampRatio;
            transform.y = targetY - dy * clampRatio;
          }
          locomotion.arrived = true;
        }
        continue;
      }

      if (locomotion.arrived) continue;

      const dist = Math.sqrt(distSq);
      const step = locomotion.speed * scaledDelta;

      const newDist = dist - step;
      const desiredDist = Math.max(newDist, harvester.range);
      const ratio = desiredDist / dist;

      transform.direction = dx >= 0 ? -1 : 1;

      transform.x = targetX - dx * ratio;
      transform.y = targetY - dy * ratio;
    }
  }
}