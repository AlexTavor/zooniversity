import { ECS } from "../../ECS";
import { getWorldEntity } from "../serialization/getWorldEntity";
import { CaveTreeLUTComponent } from "./CaveTreeLUTComponent";

export function getCaveTreeLUT(ecs: ECS): CaveTreeLUTComponent {
    const worldId = getWorldEntity(ecs); // Ensures world entity exists

    if (!ecs.hasComponent(worldId, CaveTreeLUTComponent)) {
        ecs.addComponent(worldId, new CaveTreeLUTComponent({})); // Initialize with empty LUT
    }
    return ecs.getComponent(worldId, CaveTreeLUTComponent);
}
