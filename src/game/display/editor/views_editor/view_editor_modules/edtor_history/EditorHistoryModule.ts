import {ViewDefinition} from "../../../../setup/ViewDefinition.ts";
import {DisplayModule} from "../../../../setup/DisplayModule.ts";
import {ViewsEditorModule} from "../../ViewsEditorModule.ts";
import {BaseEditorHistoryModule, HistoryContext} from "../../../common/BaseEditorHistoryModule.ts";

export type Snapshot = {
    viewMap: Record<number, ViewDefinition>;
    activeViewId: number | null;
};

export class EditorHistoryModule extends DisplayModule<ViewsEditorModule> {
    private editor!: ViewsEditorModule;
    private history:BaseEditorHistoryModule<Snapshot> = new BaseEditorHistoryModule<Snapshot>();
    
    public init(editor: ViewsEditorModule): void {
        this.editor = editor;

        this.history.init(new HistoryContext<Snapshot>(this.makeSnapshot.bind(this), this.applySnapshot.bind(this), ()=> this.editor.dirty));
    }

    public update(): void {
        this.history.update();
    }

    public destroy(): void {
        this.history.destroy();
    }

    private makeSnapshot(): Snapshot {
        return {
            viewMap: JSON.parse(JSON.stringify(this.editor.viewMap)),
            activeViewId: this.editor.activeViewId,
        };
    }

    private applySnapshot(snapshot: Snapshot): void {
        this.editor.state.applySnapshot(snapshot);
        this.editor.requestSync();
    }
}
