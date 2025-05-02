import {ViewsEditorModule} from "../../../ViewsEditorModule.ts";
import {DisplayModule} from "../../../../../setup/DisplayModule.ts";
import {PointerEvent} from "../../../../../../consts/PointerEvent.ts";
import {EventBus} from "../../../../../../EventBus.ts";
import {DnDEvent} from "../../../../../../consts/DnDEvent.ts";
import {Naming} from "../../../../../../consts/Naming.ts";

export class DeleteToolModule extends DisplayModule<ViewsEditorModule> {
    private editor!: ViewsEditorModule;

    public init(editor: ViewsEditorModule): void {
        this.editor = editor;
        const scene = editor.display.scene;

        scene.input.on(PointerEvent.PointerUp, this.handlePointerUp, this);
        EventBus.emit(DnDEvent.DragControlEnd); // disable camera while deleting
    }

    public destroy(): void {
        this.editor.display.scene.input.off(PointerEvent.PointerUp, this.handlePointerUp, this);
        EventBus.emit(DnDEvent.DragControlStart); // re-enable camera
    }

    public update(): void {
        // no-op
    }

    private handlePointerUp = (pointer: Phaser.Input.Pointer): void => {
        const sprite = this.editor.findSpriteUnderPointer(pointer);
        if (!sprite) return;

        const container = sprite.parentContainer;
        if (!container?.name?.startsWith(Naming.VIEW)) return;

        const viewId = Number(container.name.replace(Naming.VIEW, ''));
        if (isNaN(viewId)) return;

        this.removeView(viewId);
    };

    private removeView(viewId: number): void {
        const parent = this.findParentId(viewId);
        if (parent) {
            const parentView = this.editor.viewMap[parent];
            parentView.subViews = parentView.subViews.filter((id: number) => id !== viewId);
        }

        delete this.editor.viewMap[viewId];

        this.editor.requestSync();
    }

    private findParentId(childId: number): number | undefined {
        for (const [id, view] of Object.entries(this.editor.viewMap)) {
            // @ts-ignore
            if (view.subViews.includes(childId)) return Number(id);
        }
        return undefined;
    }
}
