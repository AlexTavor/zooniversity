import Phaser from "phaser";
import { ECS, Entity } from "../../ECS";
import { Config } from "../../config/Config";
import { Transform } from "../../components/Transform";
import { Tree } from "../../logic/trees/Tree";
import { HarvestableComponent } from "../../logic/trees/HarvestableComponent";
import { View } from "../setup/View";
import {
    PanelDefinition,
    ViewDefinition,
    ViewType,
} from "../setup/ViewDefinition";
import {
    ViewDisplayModule,
    registerViewDisplayModule,
} from "../setup/ViewDisplayModule";
import { EffectType } from "../setup/ViewEffectController";
import { createView as createViewDefinition } from "../setup/ViewStore";
import { GameDisplayContext } from "../GameDisplay";
import { ProgressBarConfig, ValueRef } from "../effects/ProgressBarEffect";
import { ShudderEffectConfig } from "../effects/ShudderEffect";
import { TreeFallAnimation } from "./TreeFallAnimation";
import { getTime } from "../../logic/time/TimeComponent";
import { InteractionSlots, SlotType } from "../../components/InteractionSlots";
import { ForagableComponent } from "../../logic/foraging/ForagableComponent";
import { generateUniqueApplePositions } from "./generateUniqueApplePositions";
import { PanelId, PanelRegistry } from "../data_panel/PanelRegistry";

const MAX_APPLE_SPRITES = 20;

const harvestBarConfig: ProgressBarConfig = {
    position: "left",
    offset: 50,
    valueRef: { current: 0, max: 1 },
    size: {
        minWidth: 20,
        maxWidth: 120,
        minWidthValue: 0.1,
        maxWidthValue: 1,
    },
    fillColor: 0xffaa00,
    backgroundColor: 0x111111,
    border: {
        color: 0xffffff,
        thickness: 2,
        radius: 6,
        opacity: 0.8,
    },
};

export class TreeViewModule extends ViewDisplayModule {
    private harvestRefs: Map<number, ValueRef> = new Map();
    private forageRefs: Map<number, ValueRef> = new Map();
    private fallAnimations: Map<number, TreeFallAnimation> = new Map();
    private harvested: Map<number, boolean> = new Map();

    init(context: GameDisplayContext): void {
        registerViewDisplayModule(this, context, context.viewsByEntity);
    }

    update(_delta: number): void {
        this.tracker?.update();
    }

    destroy(): void {
        this.tracker?.destroy();
        for (const anim of this.fallAnimations.values()) anim.fadeOut(500);
        this.fallAnimations.clear();
    }

    getComponentClasses(): Function[] {
        return [Transform, Tree, HarvestableComponent];
    }

    getLayerContainer(): Phaser.GameObjects.Container {
        return this.context.layers.Surface;
    }

    createDefinition(ecs: ECS, entity: Entity): ViewDefinition {
        const transform = ecs.getComponent(entity, Transform);
        const tree = ecs.getComponent(entity, Tree);

        return createViewDefinition({
            spriteName: tree.type,
            atlasName: tree.atlasKey,
            position: {
                x: Math.round(transform.x),
                y: Math.round(transform.y),
            },
            frame: 0,
            type: ViewType.TREE,
            panelDefinition: this.createPanelDefinition(),
        });
    }

    private createPanelDefinition(): PanelDefinition {
        const panel =
            PanelRegistry[PanelId.TREE_GENERIC] || new PanelDefinition();
        return panel;
    }

    updateView(ecs: ECS, entity: Entity, view: View): boolean {
        const transform = ecs.getComponent(entity, Transform);
        const tree = ecs.getComponent(entity, Tree);
        const harvestable = ecs.getComponent(entity, HarvestableComponent);

        const posX = Math.round(transform.x);
        const posY = Math.round(
            transform.y + Config.AnimImports.FrameHeight / 2,
        );
        const isFallen = harvestable.harvested;

        view.viewContainer.x = posX;
        view.viewContainer.y = posY;
        view.viewContainer.scaleY = isFallen ? 0 : 1;

        const slots = ecs.getComponent(entity, InteractionSlots);

        this.updateForagableView(ecs, entity, view);
        this.updateHarvestProgress(entity, harvestable, view);
        this.updateShudderEffect(!!slots?.inUse(SlotType.WORK), view);
        this.spawnFallAnimation(
            entity,
            tree,
            view,
            posX,
            posY,
            isFallen,
            () => {
                this.fallAnimations.delete(entity);
                this.harvested.set(entity, true);
            },
        );

        const time = getTime(ecs);
        this.fallAnimations.forEach((anim, _) => {
            const speed = time.speedFactor;
            anim.setSpeed(speed);
        });
        return false;
    }

    updateForagableView(ecs: ECS, entity: number, view: View) {
        const foragable = ecs.getComponent(entity, ForagableComponent);
        if (!foragable) return;

        const c = Math.floor(foragable.currentAmount);
        const m = Math.floor(foragable.maxAmount);

        this.showForagable(entity, c, m, view, foragable);
    }

    private showForagable(
        entity: number,
        c: number,
        m: number,
        view: View,
        foragable: ForagableComponent,
    ) {
        const valueRef = this.forageRefs.get(entity) || { current: c, max: m };
        valueRef.current = c;
        if (!this.forageRefs.has(entity)) {
            this.forageRefs.set(entity, valueRef);
            view.applyEffect(EffectType.FORAGABLE, {
                valueRef,
                spriteKey: "food",
                maxSprites: MAX_APPLE_SPRITES,
                unitsPerSprite: Math.max(
                    1,
                    foragable.maxAmount / MAX_APPLE_SPRITES,
                ),
                fixedRelativePositions: generateUniqueApplePositions(
                    entity,
                    MAX_APPLE_SPRITES,
                ),
                initialVisible: false,
                spriteScale: 0.2,
            });
        }
    }

    private updateHarvestProgress(
        entity: number,
        harvestable: HarvestableComponent,
        view: View,
    ): void {
        if (
            !harvestable.harvested &&
            harvestable.amount !== harvestable.maxAmount
        ) {
            const valueRef = this.harvestRefs.get(entity) || {
                current: harvestable.amount,
                max: harvestable.maxAmount,
            };
            valueRef.current = harvestable.amount;
            if (!this.harvestRefs.has(entity)) {
                this.harvestRefs.set(entity, valueRef);
                view.applyEffect(EffectType.Progress, {
                    ...harvestBarConfig,
                    valueRef,
                    container: this.context.layers.Icons,
                });
            }
        } else {
            this.harvestRefs.delete(entity);
            view.clearEffect(EffectType.Progress);
            view.clearEffect(EffectType.Shudder);
        }
    }

    private updateShudderEffect(inUse: boolean, view: View): void {
        if (inUse) {
            const fps = view.getSprite()?.scene.game.loop.actualFps || 60;
            view.applyEffect(EffectType.Shudder, {
                duration: 1 * fps,
                interval: 3 * fps,
                strength: 20,
            } as ShudderEffectConfig);
        } else {
            view.clearEffect(EffectType.Shudder);
        }
    }

    private spawnFallAnimation(
        entity: number,
        tree: Tree,
        view: View,
        x: number,
        y: number,
        isFallen: boolean,
        onComplete: () => void,
    ): void {
        if (
            !isFallen ||
            this.fallAnimations.has(entity) ||
            this.harvested.has(entity)
        )
            return;

        const spriteKey = tree.atlasKey || tree.type;
        const anim = new TreeFallAnimation({
            container: this.context.layers.Surface,
            scene: this.context.scene,
            spriteKey,
            position: { x, y },
            size: {
                x: view.getSprite()?.displayWidth || 64,
                y: view.getSprite()?.displayHeight || 64,
            },
            duration: 400,
            onComplete: () => {
                setTimeout(() => {
                    anim.fadeOut(500, onComplete);
                }, 200);
            },
        });

        this.fallAnimations.set(entity, anim);
    }

    createView(
        _ecs: ECS,
        _entity: number,
        views: { [key: number]: ViewDefinition },
        viewDefinition: ViewDefinition,
    ): View {
        const view = new View(
            viewDefinition.id,
            views,
            viewDefinition,
            this.context.layers.Surface,
            this.context.scene,
        );
        // view.applyEffect(EffectType.Shader, { shader: "TimeTint" });
        return view;
    }
}
