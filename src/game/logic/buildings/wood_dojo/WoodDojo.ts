import { Component, ECS, Entity } from "../../../ECS";
import { WoodDojoWorker } from "./WoodDojoWorker";

export class WoodDojo extends Component {
    public assignedCharacters: number[] = [];
    
    public assignCharacter(ecs: ECS, dojoEntityId: Entity, characterId: Entity): void {
        if (!this.assignedCharacters.includes(characterId)) {
            this.assignedCharacters.push(characterId);
        }

        if (ecs.hasEntity(characterId) && !ecs.hasComponent(characterId, WoodDojoWorker)) {
            ecs.addComponent(characterId, new WoodDojoWorker(dojoEntityId));
        }
    }

    public unassignCharacter(ecs: ECS, characterId: Entity): void {
        const index = this.assignedCharacters.indexOf(characterId);
        if (index > -1) {
            this.assignedCharacters.splice(index, 1);
        }

        if (ecs.hasEntity(characterId) && ecs.hasComponent(characterId, WoodDojoWorker)) {
            ecs.removeComponent(characterId, WoodDojoWorker);
        }
    }
}