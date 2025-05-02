import { Entity, System } from "../../ECS";
import { InputComponent, TimeSpeed } from "./InputComponent.ts";
import { GameEvent } from "../../consts/GameEvent.ts";
import { EventBus } from "../../EventBus.ts";

export class InputSystem extends System {
    public componentsRequired = new Set<Function>([InputComponent]);

    constructor() {
        super();
    }

    handleSetSpeed(speed: TimeSpeed) {
        for (const entity of this.ecs.getEntitiesWithComponent(InputComponent)) {
            const input = this.ecs.getComponent(entity, InputComponent);
            input.speed = speed;
        }
    }

    handleSelectionChange(entityId: number) {
        for (const entity of this.ecs.getEntitiesWithComponent(InputComponent)) {
            const input = this.ecs.getComponent(entity, InputComponent);
            input.selection = entityId;
        }
    }

    update(_: Set<Entity>, __: number): void {}

    initialize(): () => void {
        const boundHandleSetSpeed = this.handleSetSpeed.bind(this);
        const boundHandleSelectionChange = this.handleSelectionChange.bind(this);
        
        EventBus.on(GameEvent.SetTimeSpeed, boundHandleSetSpeed);
        EventBus.on(GameEvent.SelectionChanged, boundHandleSelectionChange);

        for (const entity of this.ecs.getEntitiesWithComponent(InputComponent)) {
            const input = this.ecs.getComponent(entity, InputComponent);
            EventBus.emit(GameEvent.SetTimeSpeed, input.speed);
        }

        return () => {
            EventBus.off(GameEvent.SetTimeSpeed, boundHandleSetSpeed);
            EventBus.off(GameEvent.SelectionChanged, boundHandleSelectionChange);
        };
    }
}
