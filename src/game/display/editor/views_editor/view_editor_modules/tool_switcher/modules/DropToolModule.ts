import {ViewsEditorModule} from "../../../ViewsEditorModule.ts";
import {DisplayModule} from "../../../../../setup/DisplayModule.ts";
import {getSelectedSpriteKey} from "../../../../common/PaletteState.ts";
import {BaseDropToolModule, DropToolContext} from "../../../../common/BaseDropToolModule.ts";

export class DropToolModule extends DisplayModule<ViewsEditorModule> {
    private editor!: ViewsEditorModule;
    private baseDropTool: BaseDropToolModule = new BaseDropToolModule();

    init(editor: ViewsEditorModule): void {
        this.editor = editor;
        this.baseDropTool.init(new DropToolContext(editor.display.scene, pos=> {
            const key = getSelectedSpriteKey();
            if (!key) return;

            this.editor.createViewFromDrop(key, pos);
            this.editor.requestSync();
        }));
    }

    public destroy(): void {
        this.baseDropTool.destroy();
    }

    update(delta: number): void {
        this.baseDropTool.update(delta);
    }
}