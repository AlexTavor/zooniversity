import {GameDisplay} from "../GameDisplay.ts";
import {DisplayModule} from "../setup/DisplayModule.ts";
import {ControlledCamera} from "./ControlledCamera.ts";
import {Config} from "../../config/Config.ts";

export class CameraModule extends DisplayModule<GameDisplay> {
    public Camera: ControlledCamera;

    override init(display: GameDisplay) {
        this.Camera = new ControlledCamera(display.scene, Config.GameWidth, Config.GameHeight, Config.Camera);
    }

    override update(delta: number) {
        this.Camera?.update(delta);
    }

    override destroy() {
        this.Camera?.destroy();
    }
}