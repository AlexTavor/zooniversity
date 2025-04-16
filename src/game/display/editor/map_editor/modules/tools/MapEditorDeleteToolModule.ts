import {MapEditorModule} from "../../MapEditorModule.ts";
import {DisplayModule} from "../../../../setup/DisplayModule.ts";
import {PointerEvents} from "../../../../../consts/PointerEvents.ts";
import {EventBus} from "../../../../../EventBus.ts";
import {DnDEvents} from "../../../../../consts/DnDEvents.ts";
import {Naming} from "../../../../../consts/Naming.ts";
import {MapObject} from "../../MapTypes.ts";

export class MapEditorDeleteToolModule extends DisplayModule<MapEditorModule> {
    private editor!: MapEditorModule;

    public init(editor: MapEditorModule): void {
        this.editor = editor;
        const scene = editor.display.scene;

        scene.input.on(PointerEvents.PointerUp, this.handlePointerUp, this);
        EventBus.emit(DnDEvents.DragControlEnd); // disable camera while deleting
    }

    public destroy(): void {
        this.editor.display.scene.input.off(PointerEvents.PointerUp, this.handlePointerUp, this);
        EventBus.emit(DnDEvents.DragControlStart); // re-enable camera
    }

    public update(): void {
        // no-op
    }

    private handlePointerUp = (pointer: Phaser.Input.Pointer): void => {
        const object = this.getMapObjectUnderPointer(pointer);
        if (!object) return;
        this.editor.state.removeObject(object.id);
    };
    
    private getMapObjectUnderPointer(pointer: Phaser.Input.Pointer): MapObject | null {
        const sprite = this.editor.findSpriteUnderPointer(pointer);
        if (!sprite) return null;

        const container = sprite.parentContainer;
        if (!container?.name?.startsWith(Naming.VIEW)) return null;

        const viewId = Number(container.name.replace(Naming.VIEW, ''));
        if (isNaN(viewId)) return null;

        return this.editor.state.getObjectById(viewId);
    }
}
