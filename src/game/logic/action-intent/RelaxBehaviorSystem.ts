import { Entity, System } from "../../ECS";
import { ActiveBuffsComponent } from "../buffs/ActiveBuffsComponent";
import { BuffType } from "../buffs/buffsData";
import { DormitoryComponent } from "../buildings/dormitory/DormitoryComponent";
import { HomeComponent } from "../buildings/dormitory/HomeComponent";
import { WoodDojo } from "../buildings/wood_dojo/WoodDojo";
import { TimeComponent } from "../time/TimeComponent";
import { ActionIntentComponent } from "./ActionIntentComponent";
import { StrollComponent } from "./StrollComponent";
import { CharacterIntent } from "./actionIntentData";


export class RelaxBehaviorSystem extends System {
    public componentsRequired = new Set<Function>([
        ActionIntentComponent
    ]);

    public update(entities: Set<Entity>, delta: number): void {
        for (const entity of entities) {
            const actionIntent = this.ecs.getComponent(entity, ActionIntentComponent);
            const hasStrollComponent = this.ecs.hasComponent(entity, StrollComponent);

            if (actionIntent.intentType === CharacterIntent.REST) {
                if (!hasStrollComponent) {
                    // Intent is REST, but not yet strolling. Initiate stroll.
                    let referencePointEntityId: Entity | null = null;
                    const home = this.ecs.getComponent(entity, HomeComponent);
                    if (home && home.homeEntityId !== null && this.ecs.hasEntity(home.homeEntityId)) {
                        referencePointEntityId = home.homeEntityId;
                    } else {
                        const dorms = this.ecs.getEntitiesWithComponent(DormitoryComponent);
                        if (dorms.length > 0) referencePointEntityId = dorms[0];
                        else {
                            const dojos = this.ecs.getEntitiesWithComponent(WoodDojo);
                            if (dojos.length > 0) referencePointEntityId = dojos[0];
                        }
                    }

                    if (referencePointEntityId !== null) {
                        this.ecs.addComponent(entity, new StrollComponent(referencePointEntityId));
                        const buffs = this.ecs.getComponent(entity, ActiveBuffsComponent);
                        const time = this.ecs.getComponent(this.ecs.getEntitiesWithComponent(TimeComponent)[0], TimeComponent);
                        
                        buffs?.addBuff(BuffType.STROLL_SPEED, time.minutesElapsed);
                    }
                }
                // If already has StrollComponent and intent is REST, StrollSystem/handleRestIntentLogic manages it.
            } else {
                // Intent is NOT REST. If character was strolling, clean up.
                if (hasStrollComponent) {
                    this.ecs.removeComponent(entity, StrollComponent);
                    const buffs = this.ecs.getComponent(entity, ActiveBuffsComponent);
                    buffs?.removeBuff(BuffType.STROLL_SPEED);
                }
            }
        }
    }
}