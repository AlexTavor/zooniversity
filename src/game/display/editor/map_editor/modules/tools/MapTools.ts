import { DisplayModule } from "../../../../setup/DisplayModule.ts";
import { MapEditorModule } from "../../MapEditorModule.ts";
import {EventBus} from "../../../../../EventBus.ts";
import {getSelectedTool, ToolType} from "../../../../setup/ToolboxState.ts";
import {DnDEvents} from "../../../../../consts/DnDEvents.ts";
import {MapEditorPaintToolModule} from "./MapEditorPaintToolModule.ts";
import {MapEditorDropToolModule} from "./MapEditorDropToolModule.ts";
import {MapEditorMoveToolModule} from "./MapEditorMoveToolModule.ts";
import {MapEditorDeleteToolModule} from "./MapEditorDeleteToolModule.ts";

export class MapTools extends DisplayModule<MapEditorModule> {
    private editor!: MapEditorModule;
    private currentTool: ToolType | null = null;
    private activeToolModule: DisplayModule<MapEditorModule> | null = null;

    public init(editor: MapEditorModule): void {
        this.editor = editor;
        this.switchTool(getSelectedTool());
    }

    public update(delta: number): void {
        const selectedTool = getSelectedTool();
        if (selectedTool !== this.currentTool) {
            this.switchTool(selectedTool);
        }

        this.activeToolModule?.update(delta);
    }

    public destroy(): void {
        this.activeToolModule?.destroy();
        this.activeToolModule = null;
    }

    private switchTool(tool: ToolType) {
        this.activeToolModule?.destroy();
        EventBus.emit(DnDEvents.DragControlEnd);

        switch (tool) {
            case 'paint':
                this.activeToolModule = new MapEditorPaintToolModule();
                break;
            case "drop":
                this.activeToolModule = new MapEditorDropToolModule();
                break;
            case "move":
                this.activeToolModule = new MapEditorMoveToolModule();
                break;
            case 'erase':
                this.activeToolModule = new MapEditorDeleteToolModule();
                break;
            default:
                this.activeToolModule = null;
                break;
        }

        this.currentTool = tool;
        this.activeToolModule?.init(this.editor);
    }
}
