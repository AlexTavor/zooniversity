import {ViewsEditorModule} from "../../../ViewsEditorModule.ts";
import {DisplayModule} from "../../../../../setup/DisplayModule.ts";
import {getSelectedSpriteKey} from "../../../../../setup/PaletteState.ts";
import {BasePaintToolModule, PaintToolContext} from "../../../../common/BasePaintToolModule.ts";

export class PaintToolModule extends DisplayModule<ViewsEditorModule> {
    private editor!: ViewsEditorModule;
    private basePaintTool: BasePaintToolModule = new BasePaintToolModule();

    init(editor: ViewsEditorModule): void {
        this.editor = editor;
        this.basePaintTool.init(new PaintToolContext(editor.display.scene, pos=> {
            this.editor.createViewFromDrop(getSelectedSpriteKey()!, pos);
            this.editor.requestSync();
        }));
    }

    public destroy(): void {
        this.basePaintTool.destroy();
    }

    update(delta: number): void {
        this.basePaintTool.update(delta);
    }
}