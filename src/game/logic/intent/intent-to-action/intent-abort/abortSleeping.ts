import { ECS, Entity } from "../../../../ECS";
import { InteractionSlots, SlotType } from "../../../../components/InteractionSlots";
import { LocomotionComponent } from "../../../locomotion/LocomotionComponent";
import { SleepingState } from "../../character-states/SleepingState";

export function abortSleeping(ecs: ECS, characterEntity: Entity): void {
    const sleeping = ecs.getComponent(characterEntity, SleepingState);
    if (!sleeping)
        return; // No sleeping state to abort
    
    ecs.getComponent(sleeping.targetBedEntityId, InteractionSlots)?.release(characterEntity, SlotType.SLEEP);
    ecs.removeComponent(characterEntity, SleepingState);

    const locomotion = ecs.getComponent(characterEntity, LocomotionComponent);
    if (locomotion) {
        locomotion.arrived = false;
    }
}