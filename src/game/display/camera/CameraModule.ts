import {GameDisplay} from "../GameDisplay.ts";
import {DisplayModule} from "../setup/DisplayModule.ts";
import {ControlledCamera} from "./ControlledCamera.ts";
import {Config} from "../../config/Config.ts";
import { EventBus } from "../../EventBus.ts";
import { GameEvent } from "../../consts/GameEvent.ts";

export class CameraModule extends DisplayModule<GameDisplay> {
    public Camera: ControlledCamera;

    override init(display: GameDisplay) {
        this.Camera = new ControlledCamera(display.scene, Config.GameWidth, Config.GameHeight, Config.Camera);
        EventBus.on(GameEvent.ViewSelected, this.handleSelectionChanged.bind(this));
    }

    private handleSelectionChanged(view:Phaser.GameObjects.Container) {
        this.Camera.lookAt(view.x, view.y);
    }

    override update(delta: number) {
        this.Camera?.update(delta);
    }

    override destroy() {
        this.Camera?.destroy();
        EventBus.off(GameEvent.ViewSelected);
    }
}