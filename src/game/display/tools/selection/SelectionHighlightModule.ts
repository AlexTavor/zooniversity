import { DisplayModule } from "../../setup/DisplayModule.ts";
import { GameDisplayContext } from "../../GameDisplay.ts";
import { GameEvent } from "../../../consts/GameEvent.ts";
import { EventBus } from "../../../EventBus.ts";
import { EffectType } from "../../setup/ViewEffectController.ts";

const OUTLINE_CONFIG = {
    thickness: 3,
    outlineColor: 0xd4a857,
    quality: 0.1,
};

export class SelectionHighlightModule extends DisplayModule<GameDisplayContext> {
    private context!: GameDisplayContext;
    private selectedEntity: number = -1;

    init(context: GameDisplayContext): void {
        this.context = context;
        EventBus.on(GameEvent.SelectionChanged, this.handleSelectionChanged, this);
    }

    destroy(): void {
        EventBus.off(GameEvent.SelectionChanged, this.handleSelectionChanged, this);
        this.clearOutline();
    }

    update(): void {}

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

        view.applyEffect(EffectType.Highlight, { 
            container: this.context.layers.Icons,
            outlineConfig: OUTLINE_CONFIG 
        });

        EventBus.emit(GameEvent.ViewSelected, view.viewContainer);
    }

    private clearOutline(): void {
        if (this.selectedEntity === -1) return;
        
        const previousView = this.context.viewsByEntity.get(this.selectedEntity);
        if (previousView) {
            previousView.clearEffect(EffectType.Highlight);
        }
        
        this.selectedEntity = -1;
    }
}