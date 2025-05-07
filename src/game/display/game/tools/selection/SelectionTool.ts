import { DisplayModule } from "../../../setup/DisplayModule.ts";
import { GameDisplayContext } from "../../../GameDisplay.ts";
import { GameEvent } from "../../../../consts/GameEvent.ts";
import { EventBus } from "../../../../EventBus.ts";
import { ITool, ToolType } from "../GameTools.ts";
import { UIEvent } from "../../../../consts/UIEvent.ts";
import { ClickThresholdHandler } from "../../../utils/ClickThresholdHandler.ts";
import { AlphaSampler } from "../../../utils/AlphaSampler.ts";

export class SelectionTool extends DisplayModule<GameDisplayContext> implements ITool {
  type: ToolType = ToolType.Selection;
  private context!: GameDisplayContext;
  private cycleStack: number[] = [];
  private cycleIndex = 0;
  private clickHandler!: ClickThresholdHandler;
  private alphaSampler!: AlphaSampler;

  init(context: GameDisplayContext): void {
    this.context = context;
    this.alphaSampler = new AlphaSampler(context.scene);
    this.clickHandler = new ClickThresholdHandler(
      context.scene,
      this.handleClick.bind(this),
      5
    );
  }

  start(): void {
    this.clickHandler.start();
    EventBus.on(UIEvent.PortraitClicked, this.onPortraitClicked, this);
  }

  stop(): void {
    this.clickHandler.stop();
    EventBus.off(UIEvent.PortraitClicked, this.onPortraitClicked, this);
  }

  destroy(): void {
    this.clickHandler.stop();
    this.alphaSampler.destroy();
  }

  update(): void {}

  private onPortraitClicked(selected: number): void {
    EventBus.emit(GameEvent.SelectionChanged, selected);
  }

  private async handleClick(pointer: Phaser.Input.Pointer): Promise<void> {
    const camera = this.context.scene.cameras.main;
    const worldPoint = pointer.positionToCamera(camera) as Phaser.Math.Vector2;

    const allViews = [...this.context.viewsByEntity.entries()];
    const overlapping: number[] = [];

    for (const [entity, view] of allViews) {
      const sprite = view.getSprite();
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
      return (vb?.getSprite()?.depth ?? 0) - (va?.getSprite()?.depth ?? 0);
    });

    if (overlapping.length === 0) {
      this.cycleStack = [];
      this.cycleIndex = 0;
      EventBus.emit(GameEvent.SelectionChanged, -1);
      return;
    }

    const sameStack = arraysEqual(overlapping, this.cycleStack);
    if (!sameStack) {
      this.cycleStack = overlapping;
      this.cycleIndex = 0;
    }

    const selected = this.cycleStack[this.cycleIndex];
    EventBus.emit(GameEvent.SelectionChanged, selected);
    this.cycleIndex = (this.cycleIndex + 1) % this.cycleStack.length;
  }
}

function arraysEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
