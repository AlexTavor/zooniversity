import { System, Entity } from "../../ECS";
import { LocationState, Transform } from "../../components/Transform";
import { ActionIntentComponent } from "../intent/intent-to-action/ActionIntentComponent";
import { CharacterAction, WalkingData} from "../intent/intent-to-action/actionIntentData";
import { TimeComponent } from "../time/TimeComponent";
import { LocomotionComponent } from "./LocomotionComponent";
import { Pos } from "../../../utils/Math";
import { InsideLocationComponent } from "./InsideLocationComponent";
import { StatCalculator } from "../buffs/StatCalculator";
import { AffectedStat } from "../buffs/buffsData";

export class LocomotionSystem extends System {
    public componentsRequired = new Set<Function>([
        LocomotionComponent,
        Transform,
        ActionIntentComponent,
    ]);

    public update(entities: Set<Entity>, delta: number): void {
        const timeEntity = this.ecs.getEntitiesWithComponent(TimeComponent)[0];
        if (!timeEntity) return;
        const time = this.ecs.getComponent(timeEntity, TimeComponent);
        if (time.speedFactor === 0) return;

        const scaledDelta = delta * time.speedFactor;

        for (const entity of entities) {
            const locomotion = this.ecs.getComponent(entity, LocomotionComponent);
            const transform = this.ecs.getComponent(entity, Transform);
            const actionIntent = this.ecs.getComponent(entity, ActionIntentComponent);

            if (!this.isEntityActivelyWalking(actionIntent)) {
                continue;
            }

            const walkData = actionIntent.actionData as WalkingData;
            const targetPosition = { 
                x: Math.round(walkData.targetPosition.x), 
                y: Math.round(walkData.targetPosition.y) 
            };

            const isArrived = this.processArrival(locomotion, transform, targetPosition);
            
            if (isArrived) {
                this.updateLocationState(transform, walkData.ultimateTargetEntityId, isArrived);
                continue; 
            }

            transform.locationState = LocationState.OUTSIDE;
            
            const speed = StatCalculator.getEffectiveStat(this.ecs, entity, AffectedStat.LOCOMOTION_SPEED);
            this.performMovementStep(transform, targetPosition, speed * scaledDelta);
            this.updateSpriteDirection(transform, targetPosition.x - transform.x);
        }
    }

    private isEntityActivelyWalking(actionIntent: ActionIntentComponent): boolean {
        return actionIntent.currentPerformedAction == CharacterAction.WALKING && !!(actionIntent?.actionData?.targetPosition);
    }

    private processArrival(locomotion: LocomotionComponent, transform: Transform, targetPos: Pos): boolean {
        const roundedCurrentX = Math.round(transform.x);
        const roundedCurrentY = Math.round(transform.y);

        if (roundedCurrentX === targetPos.x && roundedCurrentY === targetPos.y) {
            if (!locomotion.arrived) { // Actions for first arrival at exact spot
                transform.x = targetPos.x; 
                transform.y = targetPos.y;
                locomotion.arrived = true;
            }
            return true; // Is at target
        } else if (locomotion.arrived) {
            locomotion.arrived = false; // Reset arrived state if not at target
        }

        return false; // Not at target
    }
    
    private updateLocationState(transform: Transform, ultimateTargetEntityId: Entity | undefined, isArrivedAtTarget: boolean): void {
        if (ultimateTargetEntityId && this.ecs.hasEntity(ultimateTargetEntityId) && this.ecs.hasComponent(ultimateTargetEntityId, InsideLocationComponent)) {
            transform.locationState = isArrivedAtTarget ? LocationState.INSIDE : LocationState.OUTSIDE;
        }
    }

    private performMovementStep(transform: Transform, targetPos: Pos, stepDistance: number): void {
        const dx = targetPos.x - transform.x;
        const dy = targetPos.y - transform.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= stepDistance || dist === 0) {
            transform.x = targetPos.x; // Snap to exact rounded target
            transform.y = targetPos.y;
            // locomotion.arrived will be set true in the next frame by processArrival
        } else {
            transform.x += (dx / dist) * stepDistance;
            transform.y += (dy / dist) * stepDistance;
        }
    }

    private updateSpriteDirection(transform: Transform, dxToTarget: number): void {
        if (dxToTarget !== 0) {
            transform.direction = dxToTarget > 0 ? -1 : 1; // Assuming -1 is right, 1 is left
        }
    }
}