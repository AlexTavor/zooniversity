import { DisplayModule } from "../../../setup/DisplayModule.ts";
import { GameDisplayContext } from "../../../GameDisplay.ts";
import { GameEvent } from "../../../../consts/GameEvent.ts";
import { EventBus } from "../../../../EventBus.ts";
import OutlinePipelinePlugin from "phaser3-rex-plugins/plugins/outlinepipeline-plugin.js";

const OUTLINE_CONFIG = {
    thickness: 2,
    outlineColor: 0xd4a857,
    quality: 0.2,
};

export class SelectionHighlightModule extends DisplayModule<GameDisplayContext> {
    private context!: GameDisplayContext;
    private selected: number = -1;
    private outlinePlugin!: OutlinePipelinePlugin;

    init(context: GameDisplayContext): void {
        this.context = context;
        this.outlinePlugin = context.scene.plugins.get('rexOutlinePipeline') as OutlinePipelinePlugin;

        EventBus.on(GameEvent.SelectionChanged, this.handleSelectionChanged, this);
    }

    destroy(): void {
        EventBus.off(GameEvent.SelectionChanged, this.handleSelectionChanged, this);
        this.clearOutline();
    }

    update(): void {}

    private handleSelectionChanged(entity: number): void {
        if (entity === this.selected) return;

        this.clearOutline();
        this.selected = entity;

        if (entity === -1) return;

        const view = this.context.viewsByEntity.get(entity);
        if (!view) return;

        this.outlinePlugin.add(view.viewContainer, OUTLINE_CONFIG);

        EventBus.emit(GameEvent.ViewSelected, view.viewContainer);
    }

    private clearOutline(): void {
        if (this.selected === -1) return;

        const prev = this.context.viewsByEntity.get(this.selected);
        if (prev) {
            this.outlinePlugin.remove(prev.viewContainer);
        }

        this.selected = -1;
    }
}
