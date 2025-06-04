import { ECS, Entity } from "../../../../ECS";
import { InteractionSlots, SlotType } from "../../../../components/InteractionSlots";
import { LocomotionComponent } from "../../../locomotion/LocomotionComponent";
import { ForagingState } from "../../character-states/ForagingState";


export function abortForaging(ecs: ECS, characterEntity: Entity): void {
    const foragingState = ecs.getComponent(characterEntity, ForagingState);
    const slots = ecs.getComponent(foragingState?.targetForagableEntityId, InteractionSlots);
    slots?.release(characterEntity, SlotType.FORAGE);

    ecs.removeComponent(characterEntity, ForagingState);
    
    const locomotion = ecs.getComponent(characterEntity, LocomotionComponent);
    if (locomotion) {
        locomotion.arrived = false;
    }
}