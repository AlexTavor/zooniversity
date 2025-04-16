
import {EditorContext} from "../EditorHost.ts";
import {Pos} from "../../../../utils/Math.ts";
import {DisplayModule} from "../../setup/DisplayModule.ts";
import {View} from "../../setup/View.ts";
import {PointerEvents} from "../../../consts/PointerEvents.ts";
import {EventBus} from "../../../EventBus.ts";
import {DnDEvents} from "../../../consts/DnDEvents.ts";


export class MoveToolContext implements EditorContext {
    constructor(
        public scene: Phaser.Scene, 
        public getViewUnderPointer:()=>View|null,
        public moveView:(newPos:Pos, view:View)=>void,
        public layers: any = {}
    ) {}
}

export class BaseMoveToolModule extends DisplayModule<MoveToolContext> {
    private editor!: MoveToolContext;
    private dragging = false;
    private dragOffset = { x: 0, y: 0 };
    private selectedView?: View;

    public init(editor: MoveToolContext): void {
        this.editor = editor;

        const scene = editor.scene;
        scene.input.on(PointerEvents.PointerDown, this.onPointerDown, this);
        scene.input.on(PointerEvents.PointerMove, this.onPointerMove, this);
        scene.input.on(PointerEvents.PointerUp, this.onPointerUp, this);

        EventBus.emit(DnDEvents.DragControlStart); // disable camera drag
    }

    public destroy(): void {
        const scene = this.editor.scene;
        scene.input.off(PointerEvents.PointerDown, this.onPointerDown, this);
        scene.input.off(PointerEvents.PointerMove, this.onPointerMove, this);
        scene.input.off(PointerEvents.PointerUp, this.onPointerUp, this);

        this.dragging = false;
        EventBus.emit(DnDEvents.DragControlEnd); // re-enable camera drag
    }

    public update(): void {
        // no-op
    }

    private onPointerDown(pointer: Phaser.Input.Pointer): void {
        const view = this.editor.getViewUnderPointer();
        if (!view) return;

        this.selectedView = view;

        const worldX = pointer.worldX;
        const worldY = pointer.worldY;

        this.dragOffset.x = worldX - view.viewContainer.x;
        this.dragOffset.y = worldY - view.viewContainer.y;

        this.dragging = true;
    }

    private onPointerMove(pointer: Phaser.Input.Pointer): void {
        if (!this.dragging || !this.selectedView) return;

        const worldX = pointer.worldX;
        const worldY = pointer.worldY;

        const newX = worldX - this.dragOffset.x;
        const newY = worldY - this.dragOffset.y;

        this.editor.moveView({ x: newX, y: newY }, this.selectedView);
    }

    private onPointerUp(): void {
        if (this.dragging) {
            this.dragging = false;
            this.selectedView = undefined;
        }
    }
}
