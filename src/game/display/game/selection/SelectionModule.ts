import { DisplayModule } from "../../setup/DisplayModule.ts";
import { GameDisplayContext } from "../../GameDisplay.ts";
import { GameEvent } from "../../../consts/GameEvents.ts";
import { EventBus } from "../../../EventBus.ts";

export class SelectionModule extends DisplayModule<GameDisplayContext> {
    private context!: GameDisplayContext;
    private cycleStack: number[] = [];
    private cycleIndex = 0;

    private dragThreshold = 5;
    private downPos: Phaser.Math.Vector2 | null = null;

    init(context: GameDisplayContext): void {
        this.context = context;
        const input = context.scene.input;

        input.on("pointerdown", this.onPointerDown, this);
        input.on("pointerup", this.onPointerUp, this);
    }

    update(): void {}

    destroy(): void {
        const input = this.context.scene.input;
        input.off("pointerdown", this.onPointerDown, this);
        input.off("pointerup", this.onPointerUp, this);
    }

    private onPointerDown(pointer: Phaser.Input.Pointer) {
        this.downPos = pointer.position.clone();
    }

    private onPointerUp(pointer: Phaser.Input.Pointer) {
        if (!this.downPos) return;

        const upPos = pointer.position;
        const distance = Phaser.Math.Distance.BetweenPoints(this.downPos, upPos);
        this.downPos = null;

        if (distance > this.dragThreshold) return;

        this.handleClick(pointer);
    }

    private handleClick(pointer: Phaser.Input.Pointer) {
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
