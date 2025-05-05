import { DisplayModule } from "../../../setup/DisplayModule.ts";
import { GameDisplayContext } from "../../../GameDisplay.ts";
import { GameEvent } from "../../../../consts/GameEvent.ts";
import { EventBus } from "../../../../EventBus.ts";
import { ITool, ToolType } from "../GameTools.ts";
import { UIEvent } from "../../../../consts/UIEvent.ts";
import { ClickThresholdHandler } from "../../../utils/ClickThresholdHandler.ts";

export class SelectionTool extends DisplayModule<GameDisplayContext> implements ITool {
  type: ToolType = ToolType.Selection;
  private context!: GameDisplayContext;
  private cycleStack: number[] = [];
  private cycleIndex = 0;
  private clickHandler!: ClickThresholdHandler;

  init(context: GameDisplayContext): void {
    this.context = context;
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
    this.stop();
  }

  update(): void {}

  private onPortraitClicked(selected: number): void {
    EventBus.emit(GameEvent.SelectionChanged, selected);
  }

  private handleClick(pointer: Phaser.Input.Pointer): void {
    const camera = this.context.scene.cameras.main;
    const worldPoint = pointer.positionToCamera(camera) as Phaser.Math.Vector2;

    const allViews = [...this.context.viewsByEntity.entries()];
    const overlapping: number[] = [];

    for (const [entity, view] of allViews) {
      if (!view.selectable || !view.sprite?.input?.enabled) continue;

      const bounds = view.sprite.getBounds();
      if (bounds.contains(worldPoint.x, worldPoint.y)) {
        overlapping.push(entity);
      }
    }

    overlapping.sort((a, b) => {
      const va = this.context.viewsByEntity.get(a);
      const vb = this.context.viewsByEntity.get(b);
      return (vb?.sprite?.depth ?? 0) - (va?.sprite?.depth ?? 0);
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
