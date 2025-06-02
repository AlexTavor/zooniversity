import { ECS, Entity } from "../../../../ECS";
import { InteractionSlots, SlotType } from "../../../../components/InteractionSlots";
import { LocomotionComponent } from "../../../locomotion/LocomotionComponent";
import { HarvestingState } from "../../character-states/HarvestingState";


export function abortHarvesting(ecs: ECS, characterEntity: Entity): void {
    const harvesting = ecs.getComponent(characterEntity, HarvestingState);
    if (!harvesting) return;

    ecs.removeComponent(characterEntity, HarvestingState);

    const targetEntity = harvesting.target;
    const targetSlots = ecs.getComponent(targetEntity, InteractionSlots);
    targetSlots?.release(characterEntity, SlotType.WORK);

    const locomotion = ecs.getComponent(characterEntity, LocomotionComponent);
    if (locomotion) {
        locomotion.arrived = false;
    }
}
