import { EventBus } from "../../EventBus";
import { GameEvent } from "../../consts/GameEvent";
import { GameUIEvent } from "../../consts/UIEvent";
import { GameDisplayContext } from "../../display/GameDisplay";
import { DisplayModule } from "../../display/setup/DisplayModule";
import { AlphaSampler } from "../../display/utils/AlphaSampler";
import { ClickThresholdHandler } from "../../display/utils/ClickThresholdHandler";

// Helper function to compare if the selection candidates have changed.
function arraysEqual(a: number[], b: number[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

/**
 * An API module that handles the core logic for selecting entities via clicks.
 */
export class SelectionApi extends DisplayModule<GameDisplayContext> {
    private context!: GameDisplayContext;
    private clickHandler!: ClickThresholdHandler;
    private alphaSampler!: AlphaSampler;

    // State for cycling through overlapping entities
    private cycleStack: number[] = [];
    private cycleIndex = 0;

    /**
     * Initializes the module and its utilities for handling clicks and alpha sampling.
     */
    public init(context: GameDisplayContext): void {
        this.context = context;
        this.alphaSampler = new AlphaSampler(context.scene);
        this.clickHandler = new ClickThresholdHandler(
            context.scene,
            this.handleClick.bind(this),
            5, // Click vs. drag threshold
        );
        this.start(); // Start listening for clicks immediately

        EventBus.on(GameUIEvent.PortraitClicked, this.handlePortraitClicked);
    }

    private handlePortraitClicked(selected: number) {
        EventBus.emit(GameEvent.SelectionChanged, selected);
    }

    /**
     * Cleans up the click handler and alpha sampler.
     */
    public destroy(): void {
        this.stop();
        this.alphaSampler.destroy();
        EventBus.off(GameUIEvent.PortraitClicked, this.handlePortraitClicked);
    }

    public update(_delta: number): void {}

    /**
     * Starts listening for pointer events.
     */
    public start(): void {
        this.clickHandler.start();
    }

    /**
     * Stops listening for pointer events.
     */
    public stop(): void {
        this.clickHandler.stop();
    }

    /**
     * Determines which entity was clicked and emits the 'SelectionChanged' event.
     * This logic is migrated directly from the old SelectionTool.
     * @param pointer The Phaser pointer object for the click event.
     */
    private async handleClick(pointer: Phaser.Input.Pointer): Promise<void> {
        const camera = this.context.scene.cameras.main;
        const worldPoint = pointer.positionToCamera(
            camera,
        ) as Phaser.Math.Vector2;
        const allViews = [...this.context.viewsByEntity.entries()];
        const overlapping: number[] = [];

        for (const [entity, view] of allViews) {
            const sprite = view.getSprite();
            if (!view.selectable || !sprite?.input?.enabled) continue;

            const bounds = sprite.getBounds();
            if (!bounds.contains(worldPoint.x, worldPoint.y)) continue;

            const alpha = await this.alphaSampler.getAlphaAt(
                sprite,
                worldPoint.x,
                worldPoint.y,
            );
            if (alpha > 0) {
                overlapping.push(entity);
            }
        }

        if (overlapping.length === 0) {
            this.cycleStack = [];
            this.cycleIndex = 0;
            EventBus.emit(GameEvent.SelectionChanged, -1); // -1 signifies no selection
            return;
        }

        // Sort candidates by display depth to select the top-most one first
        overlapping.sort((a, b) => {
            const va = this.context.viewsByEntity.get(a);
            const vb = this.context.viewsByEntity.get(b);
            return (
                (vb?.getSprite()?.depth ?? 0) - (va?.getSprite()?.depth ?? 0)
            );
        });

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
