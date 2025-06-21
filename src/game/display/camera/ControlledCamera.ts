import Phaser from 'phaser';
import {CameraConfig} from "../../config/CameraConfig.ts";
import {PointerEvent} from "../../consts/PointerEvent.ts";
import { EventBus } from '../../EventBus.ts';

export class ControlledCamera {

    private readonly scene: Phaser.Scene;
    private readonly camera: Phaser.Cameras.Scene2D.Camera;
    private readonly config: CameraConfig; 

    private isDown = false;
    private isCountingClicks = false;
    private clickCount = 0;
    private timeout: number = 0;
    private dragInertia: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
    private lastDragDelta: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
    private readonly inertiaThresholdSq: number;
    
    public draggable: boolean = true;
    
    public constructor(
        scene: Phaser.Scene,
        worldWidth: number,
        worldHeight: number,
        config: CameraConfig, 
    ) {
        this.scene = scene;
        this.config = config;
        this.inertiaThresholdSq = this.config.InertiaThreshold * this.config.InertiaThreshold; 

        this.camera = this.scene.cameras.main;
        this.setupCamera(worldWidth, worldHeight);
    }

    public lookAt(x: number, y: number) {
        this.dragInertia.set(0, 0);

        const cam = this.camera;
        cam.pan(x,y,
          this.config.PanDurationMs,
          this.config.PanEasing,
          true
        );
      
        cam.zoomTo(
          this.config.DefaultZoom,
          this.config.ZoomDurationMs
        );
    }

    public follow(entity: Phaser.GameObjects.GameObject) {
        this.camera.startFollow(entity, true, 0.1, 0.1);
    }

    public destroy() {
        this.scene.input.off(PointerEvent.PointerDown, this.handlePointerDown, this);
        this.scene.input.off(PointerEvent.PointerUp, this.handlePointerUp, this);
        this.scene.input.off(PointerEvent.PointerMove, this.handlePointerMove, this);
        this.scene.input.off(PointerEvent.Wheel, this.handleWheel, this);
        clearTimeout(this.timeout);
    }

    private resetZoom() {
        this.dragInertia.set(0, 0);
        this.camera.pan(
            this.camera.width / 2,
            this.camera.height / 2,
            this.config.PanDurationMs,
            this.config.PanEasing,
            true
        );
        this.camera.zoomTo(
            this.config.MinZoom,
            this.config.ZoomDurationMs
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
            }, this.config.MaxTimeBetweenClicksMs);
        }
    }

    private handlePointerUp(pointer: Phaser.Input.Pointer) {
        if (this.scene.input.manager.activePointer.rightButtonDown()) {
            return;
        }
        this.dragInertia.copy(this.lastDragDelta);
        this.isDown = false;

        if (this.isCountingClicks) {
            this.clickCount++;
            if (this.clickCount === 2) {
                // TODO - fire event
                // this.resetZoom();
                const worldPoint = pointer.positionToCamera(this.camera) as Phaser.Math.Vector2;
                EventBus.emit(PointerEvent.DoubleClick, worldPoint);
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
                zoom * this.config.WheelZoomFactorIncrement,
                this.config.MinZoom,
                this.config.MaxZoom
            );
        } else {
            newZoom = Phaser.Math.Clamp(
                zoom * this.config.WheelZoomFactorDecrement, 
                this.config.MinZoom, 
                this.config.MaxZoom
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
            this.config.ZoomDurationMs
        );
        this.camera.setScroll(newX, newY);
    }

    private handlePointerMove(pointer: Phaser.Input.Pointer) {
        if (!this.isDown || !this.draggable) {
            return;
        }
        const dx = pointer.x - pointer.prevPosition.x;
        const dy = pointer.y - pointer.prevPosition.y;
        this.lastDragDelta.set(dx, dy);

        // TODO - clamp so that camera does not go out of bounds
        this.camera.scrollX -= (dx / this.camera.zoom);
        this.camera.scrollY -= (dy / this.camera.zoom);
    }

    update(_:number) {
        if (!this.isDown && this.dragInertia.lengthSq() > this.inertiaThresholdSq) {
            this.camera.scrollX -= (this.dragInertia.x / this.camera.zoom);
            this.camera.scrollY -= (this.dragInertia.y / this.camera.zoom);
            this.dragInertia.scale(this.config.DragDamping);
        } else if (this.dragInertia.x !== 0 || this.dragInertia.y !== 0) {
            this.dragInertia.set(0, 0);
        }
    }

    private setupCamera(worldWidth: number, worldHeight: number) {
        this.camera.setBackgroundColor(this.config.BackgroundColor);
        this.camera.setBounds(0, 0, worldWidth, worldHeight);

        this.scene.input.on(PointerEvent.PointerDown, this.handlePointerDown, this);
        this.scene.input.on(PointerEvent.PointerUp, this.handlePointerUp, this);
        this.scene.input.on(PointerEvent.PointerMove, this.handlePointerMove, this);
        this.scene.input.on(PointerEvent.Wheel, this.handleWheel, this);

        this.resetZoom();
    }
}