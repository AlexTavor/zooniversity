import { System, Entity } from "../../ECS.ts";
import { ActionIntentComponent } from "../work/ActionIntentComponent.ts";
import { TimeComponent } from "../time/TimeComponent.ts";
import { InteractionSlots } from "../work/InteractionSlots.ts";
import { ScheduleComponent } from "./ScheduleComponent.ts";

export class ScheduleSystem extends System {
  componentsRequired = new Set<Function>([ScheduleComponent, ActionIntentComponent]);

  update(entities: Set<Entity>, delta: number): void {
    const timeEntity = this.ecs.getEntitiesWithComponent(TimeComponent)[0];
    const time = this.ecs.getComponent(timeEntity, TimeComponent);
    const hour = time.hour;

    for (const entity of entities) {
      const schedule = this.ecs.getComponent(entity, ScheduleComponent);
      const currentAction = schedule.entries[hour];
      const intent = this.ecs.getComponent(entity, ActionIntentComponent);

      if (intent.actionType !== currentAction) {
        if (intent.targetEntityId !== -1) {
          const slots = this.ecs.getComponent(intent.targetEntityId, InteractionSlots);
          slots?.release(entity);
        }

        intent.actionType = currentAction;
      }
    }
  }
}
