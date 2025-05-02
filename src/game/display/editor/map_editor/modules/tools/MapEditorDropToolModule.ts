import {BaseDropToolModule, DropToolContext} from "../../../common/BaseDropToolModule.ts";
import {DisplayModule} from "../../../../setup/DisplayModule.ts";
import {MapEditorModule} from "../../MapEditorModule.ts";
import {PaletteType} from "../../../../../consts/EditorEvent.ts";

export class MapEditorDropToolModule extends DisplayModule<MapEditorModule> {
    private editor!: MapEditorModule;
    private baseDropTool: BaseDropToolModule = new BaseDropToolModule();

    init(editor: MapEditorModule): void {
        this.editor = editor;
        this.baseDropTool.init(new DropToolContext(editor.display.scene, pos=> {
            this.editor.state.addObjectAtWorldPosition(pos, editor.activePalette == PaletteType.trees ? 'tree' : 'cave');
        }));
    }
    
    public destroy(): void {
        this.baseDropTool.destroy();
    }
    
    update(delta: number): void {
        this.baseDropTool.update(delta);
    }
}