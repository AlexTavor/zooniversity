
import {EditorContext} from "../EditorHost.ts";
import {Pos} from "../../../../utils/Math.ts";
import {DisplayModule} from "../../setup/DisplayModule.ts";
import {PointerEvent} from "../../../consts/PointerEvent.ts";
import {EventBus} from "../../../EventBus.ts";
import {DnDEvent} from "../../../consts/DnDEvent.ts";

export class DropToolContext implements EditorContext {
    constructor(public scene: Phaser.Scene, public dropAt:(pos:Pos)=>void, public layers: any = {}) {}
}

export class BaseDropToolModule extends DisplayModule<DropToolContext> {
    private editor!: DropToolContext;

    public init(editor: DropToolContext): void {
        this.editor = editor;
        editor.scene.input.on(PointerEvent.PointerUp, this.handlePointerUp, this);
        editor.scene.input.on(PointerEvent.PointerDown, this.handlePointerDown, this);
    }

    public update(_:number): void {}

    public destroy(): void {
        this.editor.scene.input.off(PointerEvent.PointerUp, this.handlePointerUp, this);
        this.editor.scene.input.off(PointerEvent.PointerDown, this.handlePointerDown, this);
    }

    private handlePointerUp = (pointer: Phaser.Input.Pointer) => {
        EventBus.emit(DnDEvent.DragControlEnd);
        this.editor.dropAt({ x: pointer.worldX, y: pointer.worldY });
    };

    private handlePointerDown = (_: Phaser.Input.Pointer) => {
        EventBus.emit(DnDEvent.DragControlStart);
    };
}
