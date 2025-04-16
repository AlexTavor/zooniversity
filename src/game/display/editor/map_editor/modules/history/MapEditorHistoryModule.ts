import {DisplayModule} from "../../../../setup/DisplayModule.ts";
import {BaseEditorHistoryModule, HistoryContext} from "../../../common/BaseEditorHistoryModule.ts";
import {MapEditorModule} from "../../MapEditorModule.ts";
import {MapDefinition} from "../../MapTypes.ts";

export class MapEditorHistoryModule extends DisplayModule<MapEditorModule> {
    private editor!: MapEditorModule;
    private history:BaseEditorHistoryModule<MapDefinition> = new BaseEditorHistoryModule<MapDefinition>();
    
    public init(editor: MapEditorModule): void {
        this.editor = editor;

        this.history.init(new HistoryContext<MapDefinition>(this.makeSnapshot.bind(this), this.applySnapshot.bind(this), this.getDirty.bind(this)));
    }

    private getDirty(): boolean {
        return this.editor.state.dirty;
    }
    
    public update(): void {
        this.history.update();
    }

    public destroy(): void {
        this.history.destroy();
    }

    private makeSnapshot(): MapDefinition {
        return JSON.parse(JSON.stringify(this.editor.state.getMapDefinition()));
    }

    private applySnapshot(snapshot: MapDefinition): void {
        this.editor.state.loadMap(snapshot);
    }
}
