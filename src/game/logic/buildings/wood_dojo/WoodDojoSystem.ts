import { System, Entity } from "../../../ECS";
import { WoodDojo } from "./WoodDojo";

export class WoodDojoSystem extends System {
    public componentsRequired = new Set<Function>([WoodDojo]);

    public update(dojoEntities: Set<Entity>, delta: number): void {
        for (const dojoEntity of dojoEntities) {
            const dojo = this.ecs.getComponent(dojoEntity, WoodDojo);

            // Clean up non-existent characters from the assignedCharacters list
            // Iterate backwards when removing elements from an array during iteration
            for (let i = dojo.assignedCharacters.length - 1; i >= 0; i--) {
                const characterId = dojo.assignedCharacters[i];
                if (!this.ecs.hasEntity(characterId)) {
                    dojo.assignedCharacters.splice(i, 1);
                }
            }
        }
    }
}