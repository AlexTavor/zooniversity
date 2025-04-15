import {ViewsEditorModule} from "../../../ViewsEditorModule.ts";
import {DisplayModule} from "../../../../../setup/DisplayModule.ts";
import {PointerEvents} from "../../../../../../consts/PointerEvents.ts";
import {EventBus} from "../../../../../../EventBus.ts";
import {DnDEvents} from "../../../../../../consts/DnDEvents.ts";
import {getSelectedSpriteKey, setSelectedSpriteKey} from "../../../../../setup/PaletteState.ts";

export class DropToolModule extends DisplayModule<ViewsEditorModule> {
    private editor!: ViewsEditorModule;

    public init(editor: ViewsEditorModule): void {
        this.editor = editor;
        editor.display.scene.input.on(PointerEvents.PointerUp, this.handlePointerUp, this);
        editor.display.scene.input.on(PointerEvents.PointerDown, this.handlePointerDown, this);
    }

    public update(): void {}

    public destroy(): void {
        this.editor.display.scene.input.off(PointerEvents.PointerUp, this.handlePointerUp, this);
        this.editor.display.scene.input.off(PointerEvents.PointerDown, this.handlePointerDown, this);
    }

    private handlePointerUp = (pointer: Phaser.Input.Pointer) => {
        EventBus.emit(DnDEvents.DragControlEnd);
        const key = getSelectedSpriteKey();
        if (!key) return;

        this.editor.createViewFromDrop(key, { x: pointer.worldX, y: pointer.worldY });
        this.editor.requestSync();
        setSelectedSpriteKey(null);
    };

    private handlePointerDown = (_: Phaser.Input.Pointer) => {
        EventBus.emit(DnDEvents.DragControlStart);
    };
}
