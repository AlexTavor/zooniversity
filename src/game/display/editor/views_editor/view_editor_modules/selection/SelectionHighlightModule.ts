import OutlinePipelinePlugin from 'phaser3-rex-plugins/plugins/outlinepipeline-plugin.js';
import {ViewsEditorModule} from "../../ViewsEditorModule.ts";
import {DisplayModule} from "../../../../setup/DisplayModule.ts";
import {EventBus} from "../../../../../EventBus.ts";
export class SelectionHighlightModule extends DisplayModule<ViewsEditorModule> {
    private editor!: ViewsEditorModule;
    private currentSprite?: Phaser.GameObjects.Sprite;
    private outlinePlugin!: OutlinePipelinePlugin;

    public init(editor: ViewsEditorModule): void {
        this.editor = editor;

        const scene = editor.display.scene;
        this.outlinePlugin = scene.plugins.get('rexOutlinePipeline') as OutlinePipelinePlugin;

        EventBus.on('selection-changed', this.onSelectionChanged);
    }

    public destroy(): void {
        EventBus.off('selection-changed', this.onSelectionChanged);
        this.clearHighlight();
    }

    private onSelectionChanged = (viewId: number | null): void => {
        this.clearHighlight();

        if (viewId == null) return;

        const view = this.editor.findViewInstance(viewId);
        if (!view?.sprite) return;

        this.outlinePlugin.add(view.sprite, {
            thickness: 1,
            outlineColor: 0xff0000,
            quality: 0.1,
        });

        this.currentSprite = view.sprite;
    };

    private clearHighlight(): void {
        if (this.currentSprite) {
            this.outlinePlugin.remove(this.currentSprite);
            this.currentSprite = undefined;
        }
    }

    public update(_: number): void {
        
    }
}
