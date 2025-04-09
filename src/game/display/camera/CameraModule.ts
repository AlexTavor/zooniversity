import {GameDisplay} from "../GameDisplay.ts";
import {DisplayModule} from "../setup/DisplayModule.ts";
import {ControlledCamera} from "./ControlledCamera.ts";

export class CameraModule extends DisplayModule<GameDisplay> {
    public Camera: ControlledCamera;

    override init(display: GameDisplay) {
        this.Camera = new ControlledCamera(display.scene);
    }

    override update(delta: number) {
        this.Camera?.update(delta);
    }

    override destroy() {
        this.Camera?.destroy();
    }
}