import {DisplayModule} from "../../../../setup/DisplayModule.ts";
import {MapEditorModule} from "../../MapEditorModule.ts";

type MapTool = 'paint' | 'erase'; // extend as needed

export class MapTools extends DisplayModule<MapEditorModule> {
    private editor!: MapEditorModule;
    private currentTool: MapTool = 'paint';
    private activeToolModule?: DisplayModule<MapEditorModule>;

    public init(editor: MapEditorModule): void {
        this.editor = editor;
        this.switchTool(this.currentTool);
    }

    public update(delta: number): void {
        this.activeToolModule?.update(delta);
    }

    public destroy(): void {
        this.activeToolModule?.destroy();
    }

    public switchTool(tool: MapTool): void {
        if (tool === this.currentTool) return;

        this.activeToolModule?.destroy();
        this.currentTool = tool;

        switch (tool) {
            case 'paint':
                // this.activeToolModule = new TreePaintModule();
                break;
            case 'erase':
                // this.activeToolModule = new EraseModule();
                break;
        }

        this.activeToolModule?.init(this.editor);
    }

    public getCurrentTool(): MapTool {
        return this.currentTool;
    }
}
