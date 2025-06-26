import { EventBus } from "../../EventBus";
import { GameEvent } from "../../consts/GameEvent";
import { GameDisplayContext } from "../../display/GameDisplay";
import { DisplayModule } from "../../display/setup/DisplayModule";
import { EffectType } from "../../display/setup/ViewEffectController";

// The configuration for the highlight effect, taken from the old module
const OUTLINE_CONFIG = {
    thickness: 3,
    outlineColor: 0xd4a857,
    quality: 0.1,
};

/**
 * Manages the visual highlight effect for the currently selected entity.
 * It listens to the central 'SelectionChanged' event and applies/removes
 * a visual effect on the corresponding game object.
 */
export class SelectionHighlightApi extends DisplayModule<GameDisplayContext> {
    private context!: GameDisplayContext;
    private selectedEntity: number = -1;

    /**
     * Initializes the module and subscribes to the global selection event.
     */
    public init(context: GameDisplayContext): void {
        this.context = context;
        EventBus.on(
            GameEvent.SelectionChanged,
            this.handleSelectionChanged,
            this,
        );
    }

    /**
     * Unsubscribes from the selection event and clears any active highlight.
     */
    public destroy(): void {
        EventBus.off(
            GameEvent.SelectionChanged,
            this.handleSelectionChanged,
            this,
        );
        this.clearOutline();
    }

    /**
     * This module is event-driven and does not require per-frame updates.
     */
    public update(_delta: number): void {}

    /**
     * Handles a change in the game's selected entity.
     * @param newlySelectedEntity The ID of the new entity to highlight.
     */
    private handleSelectionChanged(newlySelectedEntity: number): void {
        if (this.selectedEntity === newlySelectedEntity) return;

        this.clearOutline();
        this.selectedEntity = newlySelectedEntity;

        if (this.selectedEntity === -1) {
            EventBus.emit(GameEvent.ViewSelected, null);
            return;
        }

        const view = this.context.viewsByEntity.get(this.selectedEntity);
        if (!view) return;

        // Apply a highlight effect to the new view's container.
        view.applyEffect(EffectType.Highlight, {
            container: this.context.layers.Icons,
            outlineConfig: OUTLINE_CONFIG,
        });

        EventBus.emit(GameEvent.ViewSelected, view.viewContainer);
    }

    /**
     * Removes the highlight effect from the currently selected entity.
     */
    private clearOutline(): void {
        if (this.selectedEntity === -1) return;

        const previousView = this.context.viewsByEntity.get(
            this.selectedEntity,
        );

        if (previousView) {
            previousView.clearEffect(EffectType.Highlight);
        }

        this.selectedEntity = -1;
    }
}
