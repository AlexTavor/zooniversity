import Phaser from "phaser";
import { ECS, Entity } from "../../../ECS";
import { Config } from "../../../config/Config";
import { Transform } from "../../../components/Transform";
import { Tree } from "../../../logic/trees/Tree";
import { Harvestable } from "../../../logic/work/Harvestable";
import { View } from "../../setup/View";
import { ViewDefinition, ViewType } from "../../setup/ViewDefinition";
import { ViewDisplayModule, registerViewDisplayModule } from "../../setup/ViewDisplayModule";
import { EffectType } from "../../setup/ViewEffectController";
import { createView as createViewDefinition } from "../../setup/ViewStore";
import { GameDisplayContext } from "../../GameDisplay";
import { ProgressBarConfig, ValueRef } from "../effects/ProgressBar";
import { ShudderEffectConfig } from "../effects/ShudderEffect";
import { TreeFallAnimation } from "./TreeFallAnimation";
import { TimeComponent } from "../../../logic/time/TimeComponent";

const harvestBarConfig: ProgressBarConfig = {
  position: "left",
  offset: 50,
  valueRef: { current: 0, max: 1 },
  size: {
    minWidth: 20,
    maxWidth: 120,
    minWidthValue: 0.1,
    maxWidthValue: 1
  },
  fillColor: 0xffaa00,
  backgroundColor: 0x111111,
  border: {
    color: 0xffffff,
    thickness: 2,
    radius: 6,
    opacity: 0.8
  }
};

export class TreeViewModule extends ViewDisplayModule {
  private harvestRefs: Map<number, ValueRef> = new Map();
  private fallAnimations: Map<number, TreeFallAnimation> = new Map();
  private harvested: Map<number, boolean> = new Map();

  init(context: GameDisplayContext): void {
    registerViewDisplayModule(this, context, context.viewsByEntity);
  }

  update(delta: number): void {
    this.tracker?.update();
  }

  destroy(): void {
    this.tracker?.destroy();
    for (const anim of this.fallAnimations.values()) anim.fadeOut(500);
    this.fallAnimations.clear();
  }

  getComponentClasses(): Function[] {
    return [Transform, Tree, Harvestable];
  }

  getLayerContainer(): Phaser.GameObjects.Container {
    return this.context.layers.Surface;
  }

  createDefinition(ecs: ECS, entity: Entity): ViewDefinition {
    const transform = ecs.getComponent(entity, Transform);
    const tree = ecs.getComponent(entity, Tree);

    return createViewDefinition({
      spriteName: tree.type,
      position: {
        x: Math.round(transform.x),
        y: Math.round(transform.y),
      },
      frame: 0,
      type: ViewType.TREE,
    });
  }

  updateView(ecs: ECS, entity: Entity, view: View): boolean {
    const transform = ecs.getComponent(entity, Transform);
    const tree = ecs.getComponent(entity, Tree);
    const harvestable = ecs.getComponent(entity, Harvestable);

    const posX = Math.round(transform.x);
    const posY = Math.round(transform.y + Config.AnimImports.FrameHeight / 2);
    const isFallen = harvestable.harvested;

    view.viewContainer.x = posX;
    view.viewContainer.y = posY;
    view.viewContainer.scaleY = isFallen ? 0 : 1;

    this.updateHarvestProgress(entity, harvestable, view);
    this.updateShudderEffect(tree, harvestable, view);
    this.spawnFallAnimation(entity, tree, view, posX, posY, isFallen, () => {
      this.fallAnimations.delete(entity);
      this.harvested.set(entity, true);
    });

    const timeEntity = ecs.getEntitiesWithComponent(TimeComponent)[0];
    const time = ecs.getComponent(timeEntity, TimeComponent);
    this.fallAnimations.forEach((anim, _) => {
      const speed = time.speedFactor;
      anim.setSpeed(speed);
    });
    return false;
  }

  private updateHarvestProgress(entity: number, harvestable: Harvestable, view: View): void {
    if (!harvestable.harvested && harvestable.amount !== harvestable.maxAmount) {
      const valueRef = this.harvestRefs.get(entity) || { current: harvestable.amount, max: harvestable.maxAmount };
      valueRef.current = harvestable.amount;
      if (!this.harvestRefs.has(entity)) {
        this.harvestRefs.set(entity, valueRef);
        view.applyEffect(EffectType.Progress, {
          ...harvestBarConfig,
          valueRef,
          container: this.context.layers.Icons
        });
      }
    } else {
      this.harvestRefs.delete(entity);
      view.clearEffect(EffectType.Progress);
      view.clearEffect(EffectType.Shudder);
    }
  }

  private updateShudderEffect(tree: Tree, harvestable: Harvestable, view: View): void {
    if (tree.isBeingCut && harvestable.amount > 0) {
      const fps = view.getSprite()?.scene.game.loop.actualFps || 60;
      view.applyEffect(EffectType.Shudder, {
        duration: 1 * fps,
        interval: 3 * fps,
        strength: 20
      } as ShudderEffectConfig);
    }
  }

  private spawnFallAnimation(entity: number, tree: Tree, view: View, x: number, y: number, isFallen: boolean, onComplete:()=>void): void {
    if (!isFallen || this.fallAnimations.has(entity) || this.harvested.has(entity)) return;

    const spriteKey = tree.type;
    const anim = new TreeFallAnimation({
      container: this.context.layers.Surface,
      scene: this.context.scene,
      spriteKey,
      position: { x, y },
      size: {
        x: view.getSprite()?.displayWidth || 64,
        y: view.getSprite()?.displayHeight || 64
      },
      duration: 400,
      onComplete: () => {
        setTimeout(() => {
          anim.fadeOut(500, onComplete);
        }, 200);
      }
    });

    this.fallAnimations.set(entity, anim);
  }

  createView(ecs: ECS, entity: number, views: { [key: number]: ViewDefinition }, viewDefinition: ViewDefinition): View {
    const view = new View(viewDefinition.id, views, viewDefinition, this.context.layers.Surface, this.context.scene);
    view.applyEffect(EffectType.Shader, { shader: "TimeTint" });
    return view;
  }
}
