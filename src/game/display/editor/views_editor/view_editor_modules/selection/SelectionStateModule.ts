import {ViewsEditorModule} from "../../ViewsEditorModule.ts";
import {DisplayModule} from "../../../setup/DisplayModule.ts";
import {Pos} from "../../../../../utils/Math.ts";
import {PointerEvents} from "../../../../consts/PointerEvents.ts";
import {EventBus} from "../../../../EventBus.ts";
import {Naming} from "../../../../consts/Naming.ts";

export class SelectionStateModule extends DisplayModule<ViewsEditorModule> {
    private editor!: ViewsEditorModule;
    private pointerDownPos: Pos = { x: 0, y: 0 };
    private pointerStack: Phaser.GameObjects.Sprite[] = [];
    private currentStackIndex = 0;
    private selectedViewId: number | null = null;
    private TAP_THRESHOLD_SQ = 9;

    public init(editor: ViewsEditorModule): void {
        this.editor = editor;

        const scene = editor.display.scene;
        scene.input.on(PointerEvents.PointerDown, this.handlePointerDown, this);
        scene.input.on(PointerEvents.PointerUp, this.handlePointerUp, this);
    }

    public destroy(): void {
        const scene = this.editor.display.scene;
        scene.input.off(PointerEvents.PointerDown, this.handlePointerDown, this);
        scene.input.off(PointerEvents.PointerUp, this.handlePointerUp, this);
    }

    public getSelectedViewId(): number | null {
        return this.selectedViewId;
    }

    public getSelectedDefinition() {
        return this.selectedViewId != null ? this.editor.viewMap[this.selectedViewId] : null;
    }

    public clearSelection(): void {
        this.selectedViewId = null;
        EventBus.emit('selection-changed', null);
    }

    public select(viewId: number): void {
        if (this.selectedViewId === viewId) return;
        this.selectedViewId = viewId;
        EventBus.emit('selection-changed', viewId);
    }

    private handlePointerDown(pointer: Phaser.Input.Pointer): void {
        this.pointerDownPos = { x: pointer.x, y: pointer.y };
    }

    private handlePointerUp(pointer: Phaser.Input.Pointer): void {
        const dx = pointer.x - this.pointerDownPos.x;
        const dy = pointer.y - this.pointerDownPos.y;
        const distSq = dx * dx + dy * dy;
        if (distSq > this.TAP_THRESHOLD_SQ) return;

        const objects = this.editor.display.scene.input.hitTestPointer(pointer);
        this.pointerStack = objects
            .reverse()
            .filter(o => o instanceof Phaser.GameObjects.Sprite && (o.name?.startsWith(Naming.VIEW) || o.name?.startsWith(Naming.SPRITE))) as Phaser.GameObjects.Sprite[];

        if (this.pointerStack.length > 0) {
            const next = this.pointerStack[this.currentStackIndex % this.pointerStack.length];
            this.currentStackIndex++;
            const id = this.spriteToViewId(next);
            if (id != null) {
                this.select(id);
            }
        }
    }

    private spriteToViewId(sprite: Phaser.GameObjects.Sprite): number | null {
        const parts = sprite.name?.split(Naming.SEPARATOR);
        if (parts && parts[1]) {
            return parseInt(parts[1], 10);
        }
        return null;
    }

    public update(_: number): void {
    }
}
