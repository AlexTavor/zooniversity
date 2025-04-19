import {Entity, System} from "../../ECS";
import {InputComponent, TimeSpeed} from "./InputComponent.ts";
import {GameEvent} from "../../consts/GameEvents.ts";
import {EventBus} from "../../EventBus.ts";

export class InputSystem extends System {
    public componentsRequired = new Set<Function>([InputComponent]);

    private isInitialized = false;
    
    constructor() {
        super();
    }
    
    handleSetSpeed(speed: TimeSpeed) {
        for (const entity of this.ecs.getEntitiesWithComponent(InputComponent)) {
            const input = this.ecs.getComponent(entity, InputComponent);
            input.speed = speed;
        }
    }


    update(_: Set<Entity>, __: number): void {
        if (!this.isInitialized) {
            
            EventBus.on(GameEvent.SetTimeSpeed, this.handleSetSpeed.bind(this));

            for (const entity of this.ecs.getEntitiesWithComponent(InputComponent)) {
                const input = this.ecs.getComponent(entity, InputComponent);
                EventBus.emit(GameEvent.SetTimeSpeed, input.speed);
            }
            
            this.isInitialized = true;
        }
    }
}
