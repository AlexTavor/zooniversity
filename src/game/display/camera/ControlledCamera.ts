import {Config} from "../../config/Config.ts";

export class ControlledCamera {
    static maxZoom = 4 * 2;
    static minZoom = 0.07 * 2.2;

    private scene: Phaser.Scene;
    private camera: Phaser.Cameras.Scene2D.Camera;

    public constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.setupCamera(Config.Map.WidthInPixels, Config.Map.HeightInPixels);
    }

    public destroy() {
    }

    private resetZoom(){
        this.camera.pan(this.camera.width/2, this.camera.height/2, 0.3, 'Linear', true);
        this.camera.zoomTo(ControlledCamera.minZoom, 0.3);
    }

    update(_:number) {
    }

    private setupCamera(cameraWidth: number, cameraHeight: number) {
        this.camera = this.scene.cameras.main;
        this.camera.setBackgroundColor(0x000000);
        this.camera.setBounds(0, 0, cameraWidth, cameraHeight);

        this.resetZoom();
    }
}
