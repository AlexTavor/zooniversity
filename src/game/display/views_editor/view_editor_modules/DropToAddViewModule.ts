import {ViewsEditorModule} from "../ViewsEditorModule.ts";
import {DisplayModule} from "../../setup/DisplayModule.ts";
import {EventBus} from "../../../EventBus.ts";
import {DnDEvents} from "../../../consts/DnDEvents.ts";
import {Pos} from "../../../../utils/Math.ts";

export class DropToAddViewModule extends DisplayModule<ViewsEditorModule> {
    private editor!: ViewsEditorModule;

    public init(editor: ViewsEditorModule): void {
        this.editor = editor;

        EventBus.on(DnDEvents.DragDrop, this.handleDrop);
    }

    private handleDrop = (payload: { spriteKey: string; position: Pos }) => {
        this.editor.createViewFromDrop(payload.spriteKey, payload.position);
        this.editor.markDirty();
    };

    public update(): void {}

    public destroy(): void {
        EventBus.off(DnDEvents.DragDrop, this.handleDrop);
    }
}
