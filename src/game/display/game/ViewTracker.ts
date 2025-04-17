import {View} from "../setup/View.ts";
import {ECS, Entity} from "../../ECS.ts";
import {ViewDefinition} from "../setup/ViewDefinition.ts";

export class ViewTracker {
    private viewsByEntity: Map<Entity, View> = new Map();

    constructor(
        private ecs: ECS,
        private container: Phaser.GameObjects.Container,
        private scene: Phaser.Scene,
        private requiredComponents: Function[],
        private createViewDefinition: (ecs: ECS, entity: Entity) => ViewDefinition,
        private updateViewFromDefinition: (ecs: ECS, view: View, def: ViewDefinition) => void
    ) {}

    update(): void {
        const currentEntities = new Set(
            this.ecs.getEntitiesWithComponents(this.requiredComponents)
        );

        // Remove views for destroyed entities
        for (const [entity, view] of this.viewsByEntity.entries()) {
            if (!currentEntities.has(entity)) {
                view.viewContainer.destroy();
                this.viewsByEntity.delete(entity);
            }
        }

        // Create or update views
        for (const entity of currentEntities) {
            const def = this.createViewDefinition(this.ecs, entity);
            const existingView = this.viewsByEntity.get(entity);

            if (existingView) {
                this.updateViewFromDefinition(this.ecs, existingView, def);
            } else {
                const view = new View(def.id, { [def.id]: def }, def, this.container, this.scene);
                this.viewsByEntity.set(entity, view);
            }
        }
    }

    destroy(): void {
        for (const view of this.viewsByEntity.values()) {
            view.viewContainer.destroy();
        }
        this.viewsByEntity.clear();
    }
}
