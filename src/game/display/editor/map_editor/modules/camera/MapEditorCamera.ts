import {ControlledCamera} from "../../../../camera/ControlledCamera.ts";
import {Config} from "../../../../../config/Config.ts";
import {DnDEvents} from "../../../../../consts/DnDEvents.ts";
import {EventBus} from "../../../../../EventBus.ts";
import {DisplayModule} from "../../../../setup/DisplayModule.ts";
import {MapEditorModule} from "../../MapEditorModule.ts";

export class MapEditorCameraModule extends DisplayModule<MapEditorModule> {
    private camera: ControlledCamera;

    public init(display: MapEditorModule): void {
        this.camera = new ControlledCamera(display.display.scene, Config.GameWidth, Config.GameHeight, Config.Camera);

        EventBus.on(DnDEvents.DragControlEnd, this.enableDrag);
        EventBus.on(DnDEvents.DragControlStart, this.disableDrag);
    }

    public destroy(): void {
        EventBus.off(DnDEvents.DragControlEnd, this.enableDrag);
        EventBus.off(DnDEvents.DragControlStart, this.disableDrag);
        
        this.camera.destroy();
    }

    private enableDrag = () => {
        this.camera.draggable = true;
    };

    private disableDrag = () => {
        this.camera.draggable = false;
    };

    public update(_: number): void {

    }
}
