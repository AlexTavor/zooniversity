import {DisplayModule} from "../../../../setup/DisplayModule.ts";
import {ViewsEditorModule} from "../../../ViewsEditorModule.ts";
import {PointerEvents} from "../../../../../consts/PointerEvents.ts";
import {getSelectedSpriteKey} from "../../../../setup/PaletteState.ts";
import {EventBus} from "../../../../../EventBus.ts";
import {DnDEvents} from "../../../../../consts/DnDEvents.ts";

export class PaintToolModule extends DisplayModule<ViewsEditorModule> {
    private editor!: ViewsEditorModule;
    private pointerDown = false;
    private pointerPos = { x: 0, y: 0 };

    private lastDropTime = 0;
    private dropInterval = 150;
    private paintDelay = 250;
    private paintElapsed = 0;
    private paintReady = false;

    public init(editor: ViewsEditorModule): void {
        this.editor = editor;
        const scene = editor.display.scene;
        scene.input.on(PointerEvents.PointerDown, this.handlePointerDown, this);
        scene.input.on(PointerEvents.PointerUp, this.handlePointerUp, this);
        scene.input.on(PointerEvents.PointerMove, this.handlePointerMove, this);
    }

    public destroy(): void {
        const scene = this.editor.display.scene;
        scene.input.off(PointerEvents.PointerDown, this.handlePointerDown, this);
        scene.input.off(PointerEvents.PointerUp, this.handlePointerUp, this);
        scene.input.off(PointerEvents.PointerMove, this.handlePointerMove, this);
    }

    public update(delta: number): void {
        if (!this.pointerDown) return;
        const key = getSelectedSpriteKey();
        if (!key) return;

        this.paintElapsed += delta;

        if (!this.paintReady && this.paintElapsed >= this.paintDelay) {
            this.paintReady = true;
            this.lastDropTime = this.dropInterval;
        }

        if (!this.paintReady) return;

        this.lastDropTime += delta;
        if (this.lastDropTime >= this.dropInterval) {
            this.editor.createViewFromDrop(key, this.pointerPos);
            this.editor.requestSync();
            this.lastDropTime = 0;
        }
    }

    private handlePointerDown = (pointer: Phaser.Input.Pointer) => {
        this.pointerDown = true;
        this.pointerPos = { x: pointer.worldX, y: pointer.worldY };
        this.paintElapsed = 0;
        this.paintReady = false;
        EventBus.emit(DnDEvents.DragControlStart);
    };

    private handlePointerUp = () => {
        this.pointerDown = false;
        EventBus.emit(DnDEvents.DragControlEnd);
    };

    private handlePointerMove = (pointer: Phaser.Input.Pointer) => {
        this.pointerPos = { x: pointer.worldX, y: pointer.worldY };
    };
}
