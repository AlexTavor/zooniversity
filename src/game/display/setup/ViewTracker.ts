import Phaser from "phaser";
import { ECS, Entity } from "../../ECS.ts";
import { View } from "./View.ts";
import { ViewDefinition } from "./ViewDefinition.ts";
import { getViews } from "./ViewStore.ts";
import { Pos } from "../../../utils/Math.ts";

export interface ViewTrackerOptions {
    ecs: ECS;
    scene: Phaser.Scene;
    componentClasses: Function[];
    layerContainer: Phaser.GameObjects.Container;
    createDefinition: (ecs: ECS, entity: Entity) => ViewDefinition;
    updateView: (ecs: ECS, entity: Entity, view: View) => boolean;
    createView: (
        ecs: ECS,
        entity: Entity,
        views: { [key: number]: ViewDefinition },
        viewDefinition: ViewDefinition,
    ) => View;
    viewsByEntity: Map<Entity, View>; // 👈 Shared view map
}

export class ViewTracker {
    private viewsByEntity: Map<Entity, View>;
    private viewsLocal = new Map<Entity, View>();
    private firstRun = true;

    private ecs: ECS;
    private componentClasses: Function[];
    private layerContainer: Phaser.GameObjects.Container;
    private createDefinition: (ecs: ECS, entity: Entity) => ViewDefinition;
    private updateView: (ecs: ECS, entity: Entity, view: View) => boolean;
    createView: (
        ecs: ECS,
        entity: Entity,
        views: { [key: number]: ViewDefinition },
        viewDefinition: ViewDefinition,
    ) => View;

    constructor({
        ecs,
        componentClasses,
        layerContainer,
        createDefinition,
        updateView,
        createView,
        viewsByEntity,
    }: ViewTrackerOptions) {
        this.ecs = ecs;
        this.componentClasses = componentClasses;
        this.layerContainer = layerContainer;
        this.createDefinition = createDefinition;
        this.updateView = updateView;
        this.createView = createView;
        this.viewsByEntity = viewsByEntity;
    }

    public init() {
        this.viewsLocal.clear();
        this.firstRun = true;
    }

    public update() {
        const entityList = this.ecs.getEntitiesWithComponents(
            this.componentClasses,
        );
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
                const view = this.createView(this.ecs, entity, getViews(), def);
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
                .filter((obj) => obj instanceof Phaser.GameObjects.Container)
                .map((obj) => obj as Phaser.GameObjects.Container)
                .sort((a, b) => a.y - b.y);

            sorted.forEach((c) => this.layerContainer.bringToTop(c));
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

    public static getReactCoordsFromPhaser(
        container: Phaser.GameObjects.Container,
        camera: Phaser.Cameras.Scene2D.Camera,
    ): Pos {
        const x = (container.x - camera.worldView.x) * camera.zoom;
        const y = (container.y - camera.worldView.y) * camera.zoom;

        const canvas = camera.scene.sys.game.canvas;
        const maxX = canvas.width;
        const maxY = canvas.height;

        return {
            x: Phaser.Math.Clamp(x, 0, maxX),
            y: Phaser.Math.Clamp(y, 0, maxY),
        };
    }
}
