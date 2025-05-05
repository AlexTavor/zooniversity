import { DisplayModule } from "../../../setup/DisplayModule.ts";
import { GameDisplayContext } from "../../../GameDisplay.ts";
import { GameEvent } from "../../../../consts/GameEvent.ts";
import { EventBus } from "../../../../EventBus.ts";
import { ITool, ToolType } from "../GameTools.ts";
import { ClickThresholdHandler } from "../../../utils/ClickThresholdHandler.ts";
import { Tree } from "../../../../logic/components/Tree.ts";
import { AlphaSampler } from "../../../utils/AlphaSampler.ts";

export class TreeCutSelectionTool extends DisplayModule<GameDisplayContext> implements ITool {
  type: ToolType = ToolType.TreeCutting;
  private context!: GameDisplayContext;
  private clickHandler!: ClickThresholdHandler;
  private alphaSampler!: AlphaSampler;

  init(context: GameDisplayContext): void {
    this.context = context;
    this.clickHandler = new ClickThresholdHandler(
      context.scene,
      this.handleClick.bind(this),
      5
    );

    this.alphaSampler = new AlphaSampler(context.scene);
  }

  start(): void {
    this.clickHandler.start();
  }

  stop(): void {
    this.clickHandler.stop();
  }

  destroy(): void {
    this.stop();
    this.alphaSampler.destroy();
  }

  update(): void {}

  private async handleClick(pointer: Phaser.Input.Pointer): Promise<void> {
    const camera = this.context.scene.cameras.main;
    const worldPoint = pointer.positionToCamera(camera) as Phaser.Math.Vector2;
  
    const allViews = [...this.context.viewsByEntity.entries()];
    const overlapping: number[] = [];
  
    for (const [entity, view] of allViews) {
      const sprite = view.sprite;
      if (!view.selectable || !sprite?.input?.enabled) continue;
  
      const bounds = sprite.getBounds();
      if (!bounds.contains(worldPoint.x, worldPoint.y)) continue;
  
      const alpha = await this.alphaSampler.getAlphaAt(sprite, worldPoint.x, worldPoint.y);
      if (alpha > 0) {
        overlapping.push(entity);
      }
    }
  
    overlapping.sort((a, b) => {
      const va = this.context.viewsByEntity.get(a);
      const vb = this.context.viewsByEntity.get(b);
      return (vb?.sprite?.depth ?? 0) - (va?.sprite?.depth ?? 0);
    });
  
    if (overlapping.length === 0) return;
  
    const selected = overlapping[0];
    EventBus.emit(GameEvent.TreeSelectedForCutting, selected);
  
    const tree = this.context.ecs.getComponent(selected, Tree);
    if (tree) {
      tree.selectedForCutting = !tree.selectedForCutting;
    }
  }  
}
