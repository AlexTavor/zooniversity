import { Entity, System } from "../../ECS";
import { DormitoryComponent } from "../buildings/dormitory/DormitoryComponent";
import { HomeComponent } from "../buildings/dormitory/HomeComponent";
import { WoodDojo } from "../buildings/wood_dojo/WoodDojo";
import { LocomotionComponent } from "../locomotion/LocomotionComponent";
import { ActionIntentComponent } from "./ActionIntentComponent";
import { StrollComponent } from "./StrollComponent";
import { CharacterIntent } from "./actionIntentData";


// Configuration for strolling behavior
const STROLL_SPEED_MULTIPLIER = 0.5;

export class RelaxBehaviorSystem extends System {
    public componentsRequired = new Set<Function>([
        ActionIntentComponent,
        LocomotionComponent // Needed to adjust speed and check baseSpeed
    ]);

    public update(entities: Set<Entity>, delta: number): void {
        for (const entity of entities) {
            const actionIntent = this.ecs.getComponent(entity, ActionIntentComponent);
            const locomotion = this.ecs.getComponent(entity, LocomotionComponent);
            const hasStrollComponent = this.ecs.hasComponent(entity, StrollComponent);

            if (actionIntent.intentType === CharacterIntent.REST) {
                if (!hasStrollComponent) {
                    // Intent is REST, but not yet strolling. Initiate stroll.
                    let referencePointEntityId: Entity | null = null;
                    const home = this.ecs.getComponent(entity, HomeComponent);
                    if (home && home.homeEntityId !== null && this.ecs.hasEntity(home.homeEntityId)) {
                        referencePointEntityId = home.homeEntityId;
                    } else {
                        // Fallback: find any Dormitory or WoodDojo as a reference.
                        // This could be improved to find the *closest* or an assigned one.
                        const dorms = this.ecs.getEntitiesWithComponent(DormitoryComponent);
                        if (dorms.length > 0) referencePointEntityId = dorms[0];
                        else {
                            const dojos = this.ecs.getEntitiesWithComponent(WoodDojo);
                            if (dojos.length > 0) referencePointEntityId = dojos[0];
                        }
                    }

                    if (referencePointEntityId !== null) {
                        this.ecs.addComponent(entity, new StrollComponent(referencePointEntityId));
                        locomotion.speed = locomotion.baseSpeed * STROLL_SPEED_MULTIPLIER;
                        // IntentActionSystem's handleRestIntentLogic will now pick up StrollComponent
                        // and set currentPerformedAction to WALKING or STROLLING.
                    } else {
                        // No reference point found, cannot initiate stroll.
                        // handleRestIntentLogic will likely set action to RELAXING (generic) or IDLE.
                    }
                }
                // If already has StrollComponent and intent is REST, StrollSystem/handleRestIntentLogic manages it.
            } else {
                // Intent is NOT REST. If character was strolling, clean up.
                if (hasStrollComponent) {
                    this.ecs.removeComponent(entity, StrollComponent);
                    locomotion.speed = locomotion.baseSpeed; // Restore normal speed
                    // IntentActionSystem will clear actionData when intentType changed.
                    // The currentPerformedAction will be updated by the new intent's helper.
                }
            }
        }
    }
}