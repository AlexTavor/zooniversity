import { System, Entity } from "../../ECS.ts";
import { ActionIntentComponent } from "../work/ActionIntentComponent.ts";
import { TimeComponent } from "../time/TimeComponent.ts";
import { InteractionSlots } from "../work/InteractionSlots.ts";
import { ScheduleComponent } from "./ScheduleComponent.ts";

export class ScheduleSystem extends System {
  componentsRequired = new Set<Function>([ScheduleComponent]);

  update(entities: Set<Entity>, delta: number): void {
    const timeEntity = this.ecs.getEntitiesWithComponent(TimeComponent)[0];
    const time = this.ecs.getComponent(timeEntity, TimeComponent);
    const hour = time.hour;

    for (const entity of entities) {
      const schedule = this.ecs.getComponent(entity, ScheduleComponent);
      const currentAction = schedule.entries[hour];

      const existing = this.ecs.getComponent(entity, ActionIntentComponent);
      if (!existing || existing.actionType !== currentAction) {
        if (existing && existing.targetEntityId !== -1) {
          const slots = this.ecs.getComponent(existing.targetEntityId, InteractionSlots);
          slots?.release(entity);
        }

        if (existing) {
          existing.actionType = currentAction;
          existing.targetEntityId = -1;
          existing.slotOffset = null;
        } else {
          this.ecs.addComponent(entity, new ActionIntentComponent(currentAction, -1));
        }
      }
    }
  }
}
