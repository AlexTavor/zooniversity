import {ViewsEditorModule} from "../../../ViewsEditorModule.ts";
import {DisplayModule} from "../../../../setup/DisplayModule.ts";
import {View} from "../../../../setup/View.ts";
import {PointerEvents} from "../../../../../consts/PointerEvents.ts";
import {EventBus} from "../../../../../EventBus.ts";
import {DnDEvents} from "../../../../../consts/DnDEvents.ts";
import {Naming} from "../../../../../consts/Naming.ts";

export class MoveToolModule extends DisplayModule<ViewsEditorModule> {
    private editor!: ViewsEditorModule;
    private dragging = false;
    private dragOffset = { x: 0, y: 0 };
    private selectedView?: View;

    public init(editor: ViewsEditorModule): void {
        this.editor = editor;

        const scene = editor.display.scene;
        scene.input.on(PointerEvents.PointerDown, this.onPointerDown, this);
        scene.input.on(PointerEvents.PointerMove, this.onPointerMove, this);
        scene.input.on(PointerEvents.PointerUp, this.onPointerUp, this);

        EventBus.emit(DnDEvents.DragControlStart); // disable camera drag
    }

    public destroy(): void {
        const scene = this.editor.display.scene;
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
        if (!this.editor.activeViewInstance) return;

        const sprite = this.editor.findSpriteUnderPointer(pointer);
        if (!sprite) return;

        const container = sprite.parentContainer;
        if (!container?.name?.startsWith(Naming.VIEW)) return;

        const viewId = Number(container.name.replace(Naming.VIEW, ''));
        if (isNaN(viewId)) return;

        const view = this.editor.findViewInstance(viewId);
        if (!view) return;

        // Only allow moving the selected view
        // if (this.editor.selection.selectedViewId !== viewId) return;

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

        this.selectedView.viewContainer.setPosition(newX, newY);
        this.selectedView.viewDefinition.position.x = newX;
        this.selectedView.viewDefinition.position.y = newY;

        this.editor.requestSync();
    }

    private onPointerUp(): void {
        if (this.dragging) {
            this.dragging = false;
            this.selectedView = undefined;
        }
    }
}
