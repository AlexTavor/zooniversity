import Phaser from 'phaser';
import {CameraConfig} from "../../config/CameraConfig.ts";
import {PointerEvents} from "../../consts/PointerEvents.ts";

export class ControlledCamera {

    private readonly scene: Phaser.Scene;
    private readonly camera: Phaser.Cameras.Scene2D.Camera;
    private readonly config: CameraConfig; // Use updated CameraConfig

    private isDown = false;
    private isCountingClicks = false;
    private clickCount = 0;
    private timeout: number = 0;
    private dragInertia: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
    private lastDragDelta: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
    private readonly inertiaThresholdSq: number;

    // Constructor requires CameraConfig and PointerEvents instances
    public constructor(
        scene: Phaser.Scene,
        worldWidth: number,
        worldHeight: number,
        config: CameraConfig, // Required instance
    ) {
        this.scene = scene;
        this.config = config;
        this.inertiaThresholdSq = this.config.InertiaThreshold * this.config.InertiaThreshold; // Use title case field

        this.camera = this.scene.cameras.main;
        this.setupCamera(worldWidth, worldHeight);
    }

    public destroy() {
        // Use pointerEvents instance for event names
        this.scene.input.off(PointerEvents.PointerDown, this.handlePointerDown, this);
        this.scene.input.off(PointerEvents.PointerUp, this.handlePointerUp, this);
        this.scene.input.off(PointerEvents.PointerMove, this.handlePointerMove, this);
        this.scene.input.off(PointerEvents.Wheel, this.handleWheel, this);
        clearTimeout(this.timeout);
    }

    private resetZoom() {
        this.dragInertia.set(0, 0);
        this.camera.pan(
            this.camera.width / 2,
            this.camera.height / 2,
            this.config.PanDurationMs, // Use title case field
            this.config.PanEasing, // Use PanEasing from config
            true
        );
        this.camera.zoomTo(
            this.config.MinZoom, // Use title case field
            this.config.ZoomDurationMs // Use title case field
        );
    }

    private handlePointerDown(pointer: Phaser.Input.Pointer) {
        if (pointer.rightButtonDown()) {
            return;
        }
        this.isDown = true;
        this.dragInertia.set(0, 0);
        this.lastDragDelta.set(0, 0);
        clearTimeout(this.timeout);

        if (!this.isCountingClicks) {
            this.isCountingClicks = true;
            this.timeout = window.setTimeout(() => {
                this.isCountingClicks = false;
                this.clickCount = 0;
            }, this.config.MaxTimeBetweenClicksMs); // Use title case field
        }
    }

    private handlePointerUp(_: Phaser.Input.Pointer) {
        // Check if right button *was* down before release? Original check was flawed.
        // Sticking to minimal changes per prior requests.
        if (this.scene.input.manager.activePointer.rightButtonDown()) {
            return;
        }
        this.dragInertia.copy(this.lastDragDelta);
        this.isDown = false;

        if (this.isCountingClicks) {
            this.clickCount++;
            if (this.clickCount === 2) {
                this.resetZoom();
                this.isCountingClicks = false;
                this.clickCount = 0;
                clearTimeout(this.timeout);
            }
        }
    }

    private handleWheel(pointer: Phaser.Input.Pointer) {
        const zoom = this.camera.zoom;
        let newZoom: number;

        if (pointer.deltaY < 0) {
            newZoom = Phaser.Math.Clamp(
                zoom * this.config.WheelZoomFactorIncrement, // Use title case field
                this.config.MinZoom, // Use title case field
                this.config.MaxZoom // Use title case field
            );
        } else {
            newZoom = Phaser.Math.Clamp(
                zoom * this.config.WheelZoomFactorDecrement, // Use title case field
                this.config.MinZoom, // Use title case field
                this.config.MaxZoom // Use title case field
            );
        }

        if (newZoom !== zoom) {
            this.dragInertia.set(0, 0);
            this.adjustCameraToPointer(pointer, newZoom);
        }
    }

    private adjustCameraToPointer(pointer: Phaser.Input.Pointer, newZoom: number) {
        const worldPoint = pointer.positionToCamera(this.camera) as Phaser.Math.Vector2;
        const newX = worldPoint.x - (worldPoint.x - this.camera.scrollX);
        const newY = worldPoint.y - (worldPoint.y - this.camera.scrollY);
        this.camera.zoomTo(
            newZoom,
            this.config.ZoomDurationMs // Use title case field
        );
        this.camera.setScroll(newX, newY);
    }

    private handlePointerMove(pointer: Phaser.Input.Pointer) {
        if (!this.isDown) {
            return;
        }
        const dx = pointer.x - pointer.prevPosition.x;
        const dy = pointer.y - pointer.prevPosition.y;
        this.lastDragDelta.set(dx, dy);
        this.camera.scrollX -= (dx / this.camera.zoom);
        this.camera.scrollY -= (dy / this.camera.zoom);
    }

    update(_:number) {
        if (!this.isDown && this.dragInertia.lengthSq() > this.inertiaThresholdSq) {
            this.camera.scrollX -= (this.dragInertia.x / this.camera.zoom);
            this.camera.scrollY -= (this.dragInertia.y / this.camera.zoom);
            this.dragInertia.scale(this.config.DragDamping); // Use title case field
        } else if (this.dragInertia.x !== 0 || this.dragInertia.y !== 0) {
            this.dragInertia.set(0, 0);
        }
    }

    private setupCamera(worldWidth: number, worldHeight: number) {
        this.camera.setBackgroundColor(this.config.BackgroundColor); // Use title case field
        this.camera.setBounds(0, 0, worldWidth, worldHeight);

        // Use pointerEvents instance for event names
        this.scene.input.on(PointerEvents.PointerDown, this.handlePointerDown, this);
        this.scene.input.on(PointerEvents.PointerUp, this.handlePointerUp, this);
        this.scene.input.on(PointerEvents.PointerMove, this.handlePointerMove, this);
        this.scene.input.on(PointerEvents.Wheel, this.handleWheel, this);

        this.resetZoom();
    }
}