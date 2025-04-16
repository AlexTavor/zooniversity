import { DisplayModule } from "../../setup/DisplayModule";
import { PointerEvents } from "../../../consts/PointerEvents";
import {getSelectedSpriteKey} from "../../setup/PaletteState.ts";
import {EventBus} from "../../../EventBus.ts";
import {DnDEvents} from "../../../consts/DnDEvents.ts";
import {EditorContext} from "../EditorHost.ts";
import {Pos} from "../../../../utils/Math.ts";

export class PaintToolContext implements EditorContext {
    constructor(public scene: Phaser.Scene, public paintAt:(pos:Pos)=>void, public layers: any = {}) {}
}

export class BasePaintToolModule extends DisplayModule<PaintToolContext> {
    private editor!: PaintToolContext;
    private pointerDown = false;
    private pointerPos = {x: 0, y: 0};

    private lastDropTime = 0;
    private dropInterval = 150;
    private paintDelay = 250;
    private paintElapsed = 0;
    private paintReady = false;

    init(editor: PaintToolContext): void {
        this.editor = editor;
        const scene = editor.scene;
        scene.input.on(PointerEvents.PointerDown, this.handlePointerDown, this);
        scene.input.on(PointerEvents.PointerUp, this.handlePointerUp, this);
        scene.input.on(PointerEvents.PointerMove, this.handlePointerMove, this);
    }

    public destroy(): void {
        const scene = this.editor.scene;
        scene.input.off(PointerEvents.PointerDown, this.handlePointerDown, this);
        scene.input.off(PointerEvents.PointerUp, this.handlePointerUp, this);
        scene.input.off(PointerEvents.PointerMove, this.handlePointerMove, this);
    }

    update(delta: number): void {
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
            this.editor.paintAt(this.pointerPos);
            this.lastDropTime = 0;
        }
    }

    private handlePointerDown = (pointer: Phaser.Input.Pointer) => {
        this.pointerDown = true;
        this.pointerPos = {x: pointer.worldX, y: pointer.worldY};
        this.paintElapsed = 0;
        this.paintReady = false;
        EventBus.emit(DnDEvents.DragControlStart);
    };

    private handlePointerUp = () => {
        this.pointerDown = false;
        EventBus.emit(DnDEvents.DragControlEnd);
    };

    private handlePointerMove = (pointer: Phaser.Input.Pointer) => {
        this.pointerPos = {x: pointer.worldX, y: pointer.worldY};
    };
}