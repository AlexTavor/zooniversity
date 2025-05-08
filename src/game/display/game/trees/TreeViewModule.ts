
import Phaser from "phaser";
import { ECS, Entity } from "../../../ECS";
import { Config } from "../../../config/Config";
import { Transform } from "../../../logic/components/Transform";
import { Tree } from "../../../logic/components/Tree";
import { Harvestable } from "../../../logic/work/Harvestable";
import { View } from "../../setup/View";
import { ViewDefinition, ViewType } from "../../setup/ViewDefinition";
import { ViewDisplayModule, registerViewDisplayModule } from "../../setup/ViewDisplayModule";
import { EffectType } from "../../setup/ViewEffectController";
import { createView as createViewDefinition } from "../../setup/ViewStore";
import { GameDisplayContext } from "../../GameDisplay";
import { ProgressBarConfig, ValueRef } from "../effects/ProgressBar";

const treeCutRateBarConfig: ProgressBarConfig = {
  position: "left",
  offset: 50,
  valueRef: {
    current: 0,
    max: 1
  },
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
  valueRefs: Map<number, ValueRef> = new Map();

  init(context: GameDisplayContext): void {
    registerViewDisplayModule(this, context, context.viewsByEntity);
  }

  update(delta: number): void {
    this.tracker?.update();
  }

  destroy(): void {
    this.tracker?.destroy();
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

    const view = createViewDefinition({
      spriteName: tree.type,
      position: {
        x: Math.round(transform.x),
        y: Math.round(transform.y),
      },
      frame: 0,
      type: ViewType.TREE,
    });

    return view;
  }

  updateView(ecs: ECS, entity: Entity, view: View): boolean {
    const transform = ecs.getComponent(entity, Transform);
    view.viewContainer.x = Math.round(transform.x);
    view.viewContainer.y = Math.round(transform.y + Config.AnimImports.FrameHeight / 2);

    const harvestable = ecs.getComponent(entity, Harvestable);
    view.viewContainer.scaleY = harvestable.harvested ? 0 : 1;

    if (!harvestable.harvested && harvestable.amount != harvestable.maxAmount) {
      const valueRef = this.valueRefs.get(entity) || { current: harvestable.amount, max: harvestable.maxAmount };
      valueRef.current = harvestable.amount;

      if (!this.valueRefs.has(entity)) {
        this.valueRefs.set(entity, valueRef);
        view.applyEffect(EffectType.Progress, {...treeCutRateBarConfig, valueRef: valueRef, container: this.context.layers.Icons});
      }
    } else {
      this.valueRefs.delete(entity);
      view.clearEffect(EffectType.Progress);
    }
      
    return false;
  }

  createView(ecs: ECS, entity: number, views: { [key: number]: ViewDefinition; }, viewDefinition: ViewDefinition): View {
    const view = new View(viewDefinition.id, views, viewDefinition, this.context.layers.Surface, this.context.scene);
    view.applyEffect(EffectType.Shader, { shader: "TimeTint" });
    return view;
  }
}
