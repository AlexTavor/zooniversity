
import {EditorContext} from "../EditorHost.ts";
import {Pos} from "../../../../utils/Math.ts";
import {DisplayModule} from "../../setup/DisplayModule.ts";
import {PointerEvents} from "../../../consts/PointerEvents.ts";
import {EventBus} from "../../../EventBus.ts";
import {DnDEvents} from "../../../consts/DnDEvents.ts";
import {setSelectedSpriteKey} from "../../setup/PaletteState.ts";

export class DropToolContext implements EditorContext {
    constructor(public scene: Phaser.Scene, public dropAt:(pos:Pos)=>void, public layers: any = {}) {}
}

export class BaseDropToolModule extends DisplayModule<DropToolContext> {
    private editor!: DropToolContext;

    public init(editor: DropToolContext): void {
        this.editor = editor;
        editor.scene.input.on(PointerEvents.PointerUp, this.handlePointerUp, this);
        editor.scene.input.on(PointerEvents.PointerDown, this.handlePointerDown, this);
    }

    public update(_:number): void {}

    public destroy(): void {
        this.editor.scene.input.off(PointerEvents.PointerUp, this.handlePointerUp, this);
        this.editor.scene.input.off(PointerEvents.PointerDown, this.handlePointerDown, this);
    }

    private handlePointerUp = (pointer: Phaser.Input.Pointer) => {
        EventBus.emit(DnDEvents.DragControlEnd);
        this.editor.dropAt({ x: pointer.worldX, y: pointer.worldY });
        setSelectedSpriteKey(null);
    };

    private handlePointerDown = (_: Phaser.Input.Pointer) => {
        EventBus.emit(DnDEvents.DragControlStart);
    };
}
