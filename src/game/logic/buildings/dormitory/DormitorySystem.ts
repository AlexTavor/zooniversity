import { System, Entity } from "../../../ECS";
import { DormitoryComponent } from "./DormitoryComponent";

export class DormitorySystem extends System {
    public componentsRequired = new Set<Function>([DormitoryComponent]);

    public update(dormitoryEntities: Set<Entity>, delta: number): void {
        for (const dormitoryEntity of dormitoryEntities) {
            const dorm = this.ecs.getComponent(dormitoryEntity, DormitoryComponent);

            for (let i = dorm.assignedCharacters.length - 1; i >= 0; i--) {
                const characterId = dorm.assignedCharacters[i];
                if (!this.ecs.hasEntity(characterId)) {
                    dorm.assignedCharacters.splice(i, 1);
                }
            }
        }
    }
}