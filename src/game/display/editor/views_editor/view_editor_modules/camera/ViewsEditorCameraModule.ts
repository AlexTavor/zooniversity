import {ViewsEditorModule} from "../../ViewsEditorModule.ts";
import {DisplayModule} from "../../../../setup/DisplayModule.ts";
import {ControlledCamera} from "../../../../camera/ControlledCamera.ts";
import {Config} from "../../../../../config/Config.ts";
import {EventBus} from "../../../../../EventBus.ts";
import {DnDEvent} from "../../../../../consts/DnDEvent.ts";

export class ViewsEditorCameraModule extends DisplayModule<ViewsEditorModule> {
    private camera: ControlledCamera;

    public init(display: ViewsEditorModule): void {
        this.camera = new ControlledCamera(display.display.scene, Config.GameWidth, Config.GameHeight, Config.Camera);
        
        EventBus.on(DnDEvent.DragControlEnd, this.enableDrag);
        EventBus.on(DnDEvent.DragControlStart, this.disableDrag);
    }

    public destroy(): void {
        EventBus.off(DnDEvent.DragControlEnd, this.enableDrag);
        EventBus.off(DnDEvent.DragControlStart, this.disableDrag);
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
