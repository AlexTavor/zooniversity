import Phaser from "phaser";
import { ECS, Entity } from "../../ECS.ts";
import { View } from "../setup/View.ts";
import { ViewDefinition } from "../setup/ViewDefinition.ts";
import { getViews } from "../setup/ViewStore.ts";
import { EventBus } from "../../EventBus.ts";
import { GameEvent } from "../../consts/GameEvents.ts";

export interface ViewTrackerOptions {
    ecs: ECS;
    scene: Phaser.Scene;
    componentClasses: Function[];
    layerContainer: Phaser.GameObjects.Container;
    createDefinition: (ecs: ECS, entity: Entity) => ViewDefinition;
    updateView: (ecs: ECS, entity: Entity, view: View) => boolean;
    viewsByEntity: Map<Entity, View>; // 👈 Shared view map
}

export class ViewTracker {
    private viewsByEntity: Map<Entity, View>;
    private viewsLocal = new Map<Entity, View>();
    private firstRun = true;

    private ecs: ECS;
    private scene: Phaser.Scene;
    private componentClasses: Function[];
    private layerContainer: Phaser.GameObjects.Container;
    private createDefinition: (ecs: ECS, entity: Entity) => ViewDefinition;
    private updateView: (ecs: ECS, entity: Entity, view: View) => boolean;

    constructor({
                    ecs,
                    scene,
                    componentClasses,
                    layerContainer,
                    createDefinition,
                    updateView,
                    viewsByEntity
                }: ViewTrackerOptions) {
        this.ecs = ecs;
        this.scene = scene;
        this.componentClasses = componentClasses;
        this.layerContainer = layerContainer;
        this.createDefinition = createDefinition;
        this.updateView = updateView;
        this.viewsByEntity = viewsByEntity;
    }

    public init() {
        this.viewsLocal.clear();
        this.firstRun = true;
    }

    public update() {
        const entityList = this.ecs.getEntitiesWithComponents(this.componentClasses);
        const currentSet = new Set<Entity>(entityList);
        let changed = this.firstRun;

        // Remove destroyed entities
        for (const [entity, view] of this.viewsLocal) {
            if (!currentSet.has(entity)) {
                view.viewContainer.destroy();
                this.viewsLocal.delete(entity);
                this.viewsByEntity.delete(entity); // 🔁 global map cleanup
                changed = true;
            }
        }

        // Add newly created entities
        for (const entity of entityList) {
            if (!this.viewsLocal.has(entity)) {
                const def = this.createDefinition(this.ecs, entity);
                const view = new View(def.id, getViews(), def, this.layerContainer, this.scene);
                this.viewsLocal.set(entity, view);
                this.viewsByEntity.set(entity, view); // 🔁 global map update
                changed = true;
            }
        }

        // Update all tracked views
        for (const [entity, view] of this.viewsLocal) {
            if (this.updateView(this.ecs, entity, view)) {
                changed = true;
            }
        }

        if (changed) {
            const sorted = this.layerContainer.list
                .filter(obj => obj instanceof Phaser.GameObjects.Container)
                .map(obj => obj as Phaser.GameObjects.Container)
                .sort((a, b) => (a.y - b.y));

            sorted.forEach(c => this.layerContainer.bringToTop(c));
        }

        this.firstRun = false;
    }

    public destroy() {
        for (const view of this.viewsLocal.values()) {
            view.viewContainer.destroy();
        }
        for (const entity of this.viewsLocal.keys()) {
            this.viewsByEntity.delete(entity);
        }
        this.viewsLocal.clear();
    }
}
