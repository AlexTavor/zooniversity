import { DisplayModule } from '../../setup/DisplayModule';
import { ViewsEditorState } from './ViewsEditorState';
import { ViewsEditorCameraModule } from './view_editor_modules/camera/ViewsEditorCameraModule';
import { ToolSwitcherModule } from './view_editor_modules/tool_switcher/ToolSwitcherModule';
import { ToolPreviewModule } from './view_editor_modules/tool_switcher/modules/ToolPreviewModule';
import { EditorHistoryModule } from './view_editor_modules/edtor_history/EditorHistoryModule';
import { SelectionStateModule } from './view_editor_modules/selection/SelectionStateModule';
import { SelectionHighlightModule } from './view_editor_modules/selection/SelectionHighlightModule';
import {View} from "../../setup/View.ts";
import {Pos} from "../../../../utils/Math.ts";
import {EditorContext} from "../EditorHost.ts";
import {clearViews} from "../../setup/ViewStore.ts";

export class ViewsEditorModule extends DisplayModule<EditorContext> {
    public display!: EditorContext;
    public state!: ViewsEditorState;
    public dirty = false;

    private modules: DisplayModule<ViewsEditorModule>[] = [
        new ViewsEditorCameraModule(),
        new ToolSwitcherModule(),
        new SelectionStateModule(),
        new SelectionHighlightModule(),
        new ToolPreviewModule(),
        new EditorHistoryModule(),
    ];

    public init(display: EditorContext): void {
        this.display = display;
        this.state = new ViewsEditorState(display);
        this.state.createRootView();
        this.modules.forEach(m => m.init(this));
    }

    public update(delta: number): void {
        this.modules.forEach(m => m.update(delta));

        if (this.dirty) {
            const def = this.state.viewMap[this.state.activeViewId!];
            if (!def) this.state.clearActiveInstance();
            this.state.renderActiveView();
            this.state.activeViewInstance?.sortSubviewsByY();
            this.dirty = false;
        }
    }

    public destroy(): void {
        this.modules.forEach(m => m.destroy());
        this.state.clearActiveInstance();
        clearViews();
    }

    public requestSync(): void {
        this.dirty = true;
    }

    public findSpriteUnderPointer(pointer: Phaser.Input.Pointer): Phaser.GameObjects.Sprite | undefined {
        const hits = this.display.scene.input.hitTestPointer(pointer);
        return hits.find(h => h instanceof Phaser.GameObjects.Sprite) as Phaser.GameObjects.Sprite | undefined;
    }

    // -- View state access
    public get viewMap() {
        return this.state.viewMap;
    }

    public get activeViewId() {
        return this.state.activeViewId;
    }

    public get activeViewInstance() {
        return this.state.activeViewInstance;
    }

    public findViewInstance(viewId: number): View | null {
        return this.state.findViewInstance(viewId);
    }

    public createViewFromDrop(spriteKey: string, position: Pos): void {
        this.state.createViewFromDrop(spriteKey, position);
        this.requestSync();
    }
}
