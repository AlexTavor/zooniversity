import { System, Entity } from "../../ECS";
import { ResourceComponent } from "./ResourceComponent";
import { ResourceTracker } from "./ResourceTracker";
import { ResourceType } from "./ResourceType";

export class ResourceSystem extends System {
    public componentsRequired = new Set<Function>([ResourceComponent]);

    private lastState: Record<ResourceType, number> = {
        [ResourceType.MONEY]: -1,
        [ResourceType.WOOD]: -1,
        [ResourceType.FOOD]: -1,
        [ResourceType.TOOLS]: -1
    };

    update(_: Set<Entity>, __: number): void {
        const entity = this.ecs.getEntitiesWithComponent(ResourceComponent)[0];
        if (entity === undefined) return;

        const res = this.ecs.getComponent(entity, ResourceComponent);
        const changed: Partial<Record<ResourceType, number>> = {};

        for (const type of Object.values(ResourceType)) {
            const current = Math.max(0, Math.floor(res.amounts[type]));
            if (current !== this.lastState[type]) {
                this.lastState[type] = current;
                changed[type] = current;
            }
        }

        if (Object.keys(changed).length > 0) {
            ResourceTracker.bulkSet(changed);
        }
    }
}
