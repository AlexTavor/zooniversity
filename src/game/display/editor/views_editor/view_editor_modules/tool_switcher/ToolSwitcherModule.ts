import {DisplayModule} from "../../../setup/DisplayModule.ts";
import {ViewsEditorModule} from "../../ViewsEditorModule.ts";
import {getSelectedTool, ToolType} from "../../../setup/ToolboxState.ts";
import {DropToolModule} from "./modules/DropToolModule.ts";
import {PaintToolModule} from "./modules/PaintToolModule.ts";
import {EventBus} from "../../../../EventBus.ts";
import {DnDEvents} from "../../../../consts/DnDEvents.ts";
import {DeleteToolModule} from "./modules/DeleteToolModule.ts";
import {MoveToolModule} from "./modules/MoveToolModule.ts";

export class ToolSwitcherModule extends DisplayModule<ViewsEditorModule> {
    private editor!: ViewsEditorModule;
    private currentTool: ToolType | null = null;
    private activeToolModule: DisplayModule<ViewsEditorModule> | null = null;

    public init(editor: ViewsEditorModule): void {
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
            case 'drop' as ToolType:
                this.activeToolModule = new DropToolModule();
                break;
            case 'paint' as ToolType:
                this.activeToolModule = new PaintToolModule();
                break;
            case 'erase':
                this.activeToolModule = new DeleteToolModule();
                break;
            case 'move':
                this.activeToolModule = new MoveToolModule();
                break;
            default:
                this.activeToolModule = null;
                break;
        }

        this.currentTool = tool;
        this.activeToolModule?.init(this.editor);
    }
}
