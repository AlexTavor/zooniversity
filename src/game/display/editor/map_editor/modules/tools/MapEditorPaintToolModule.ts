import {MapEditorModule} from "../../MapEditorModule.ts";
import {DisplayModule} from "../../../../setup/DisplayModule.ts";
import {BasePaintToolModule, PaintToolContext} from "../../../common/BasePaintToolModule.ts";
import {PaletteType} from "../../../../../consts/EditorEvent.ts";

export class MapEditorPaintToolModule extends DisplayModule<MapEditorModule> {
    private editor!: MapEditorModule;
    private basePaintTool: BasePaintToolModule = new BasePaintToolModule();
    
    init(editor: MapEditorModule): void {
        this.editor = editor;
        this.basePaintTool.init(new PaintToolContext(editor.display.scene, pos=> {
            this.editor.state.addObjectAtWorldPosition(pos, editor.activePalette == PaletteType.trees ? 'tree' : 'cave');
        }));
    }

    public destroy(): void {
        this.basePaintTool.destroy();
    }

    update(delta: number): void {
        this.basePaintTool.update(delta);
    }
}
