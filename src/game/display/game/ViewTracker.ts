import Phaser from "phaser";
import {ECS, Entity} from "../../ECS.ts";
import {ViewDefinition} from "../setup/ViewDefinition.ts";
import {View} from "../setup/View.ts";
import {getViews} from "../setup/ViewStore.ts";
import Container = Phaser.GameObjects.Container;

export interface ViewTrackerOptions {
    ecs: ECS;
    scene: Phaser.Scene;
    componentClasses: Function[];
    layerContainer: Phaser.GameObjects.Container;
    createDefinition: (ecs: ECS, entity: Entity) => ViewDefinition;
    updateView: (ecs: ECS, entity: Entity, view: View) => boolean;

    /** Optional: Called when a new View is created */
    onViewCreated?: (view: View) => void;

    /** Optional: Called when a View is removed */
    onViewDestroyed?: (view: View) => void;
}

export class ViewTracker {
    private viewsByEntity = new Map<Entity, View>();
    private viewByContainer = new Map<Phaser.GameObjects.Container, View>();
    private firstRun = true;

    private ecs: ECS;
    private scene: Phaser.Scene;
    private componentClasses: Function[];
    private layerContainer: Phaser.GameObjects.Container;
    private createDefinition: (ecs: ECS, entity: Entity) => ViewDefinition;
    private updateView: (ecs: ECS, entity: Entity, view: View) => boolean;
    options: ViewTrackerOptions;
    
    constructor(options: ViewTrackerOptions) {
        this.options = options;
        const {
            ecs,
            scene,
            componentClasses,
            layerContainer,
            createDefinition,
            updateView,
        } = options;
        
        this.ecs = ecs;
        this.scene = scene;
        this.componentClasses = componentClasses;
        this.layerContainer = layerContainer;
        this.createDefinition = createDefinition;
        this.updateView = updateView;
    }

    public init() {
        this.viewsByEntity.clear();
        this.viewByContainer.clear();
        this.firstRun = true;
    }

    public update() {
        const entityList = this.ecs.getEntitiesWithComponents(this.componentClasses);
        const currentSet = new Set<Entity>(entityList);

        let changed = this.firstRun;
        this.firstRun = false;

        // 1) Remove views for stale entities
        for (const [entity, view] of this.viewsByEntity) {
            if (!currentSet.has(entity)) {
                view.viewContainer.destroy();
                this.viewsByEntity.delete(entity);
                this.viewByContainer.delete(view.viewContainer);

                this.options.onViewDestroyed?.(view);
                
                changed = true;
            }
        }

        // 2) Add views for new entities
        for (const entity of entityList) {
            if (!this.viewsByEntity.has(entity)) {
                const def = this.createDefinition(this.ecs, entity);
                const view = new View(def.id, getViews(), def, this.layerContainer, this.scene);
                this.viewsByEntity.set(entity, view);
                this.viewByContainer.set(view.viewContainer, view);

                this.options.onViewCreated?.(view);
                
                changed = true;
            }
        }

        // 3) Update all existing views
        for (const [entity, view] of this.viewsByEntity) {
            if (this.updateView(this.ecs, entity, view)) {
                changed = true;
            }
        }

        // 4) Sort layer children by view y-position if anything changed
        if (changed) {
            const containers = this.layerContainer.list.filter(
                obj => obj instanceof Container
            ) as Container[];

            containers.sort((a, b) => {
                const va = this.viewByContainer.get(a);
                const vb = this.viewByContainer.get(b);

                const za = va?.viewDefinition.position.y ?? 0;
                const zb = vb?.viewDefinition.position.y ?? 0;

                return za - zb;
            });

            containers.forEach(c => this.layerContainer.bringToTop(c));
        }
    }

    public destroy() {
        for (const view of this.viewsByEntity.values()) {
            view.viewContainer.destroy();
        }
        this.viewsByEntity.clear();
        this.viewByContainer.clear();
    }
}