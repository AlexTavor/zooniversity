
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
import { createView } from "../../setup/ViewStore";
import { GameDisplayContext } from "../../GameDisplay";


export class TreeViewModule extends ViewDisplayModule {
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

    return createView({
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
    view.viewContainer.x = Math.round(transform.x);
    view.viewContainer.y = Math.round(transform.y + Config.AnimImports.FrameHeight / 2);

    const harvestable = ecs.getComponent(entity, Harvestable);
    view.viewContainer.scaleY = harvestable.harvested ? 0 : 1;

    return false;
  }

  createView(id: number, views: { [key: number]: ViewDefinition }, viewDefinition: ViewDefinition): View {
    const view = new View(id, views, viewDefinition, this.context.layers.Surface, this.context.scene);
    view.applyEffect(EffectType.Shader, { shader: "TimeTint" });
    return view;
  }
}
