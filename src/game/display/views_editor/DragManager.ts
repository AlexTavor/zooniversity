import Phaser from 'phaser';
import { SpriteKey, SpriteLibrary } from './SpriteLibrary';
import {DnDEvents} from "../../consts/DnDEvents.ts";
import {PointerEvents} from "../../consts/PointerEvents.ts";
import {EventBus} from "../../EventBus.ts";

interface DragPayload {
    spriteKey: SpriteKey;
    source: 'palette';
}

export class DragManager {
    private scene: Phaser.Scene;
    private payload: DragPayload | null = null;
    private preview: Phaser.GameObjects.Sprite | null = null;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        this.scene.input.on(PointerEvents.PointerMove, this.handlePointerMove, this);
        this.scene.input.on(PointerEvents.PointerUp, this.handlePointerUp, this);
    }

    public startDrag(payload: DragPayload): void {
        if (this.preview) this.preview.destroy();

        this.payload = payload;
        const def = SpriteLibrary[payload.spriteKey];
        this.preview = this.scene.add.sprite(0, 0, payload.spriteKey)
            .setAlpha(0.5)
            .setScale(def.defaultSize.x, def.defaultSize.y)
            .setDepth(10000)
            .setOrigin(0.5, 0.5);

        EventBus.emit(DnDEvents.DragStart, payload);
    }

    private handlePointerMove(pointer: Phaser.Input.Pointer): void {
        if (this.preview) {
            this.preview.setPosition(pointer.worldX, pointer.worldY);
        }
    }

    private handlePointerUp(pointer: Phaser.Input.Pointer): void {
        if (!this.payload || !this.preview) return;

        const dropSuccess = this.isPointerOverCanvas(pointer);

        if (dropSuccess) {
            EventBus.emit(DnDEvents.DragDrop, {
                spriteKey: this.payload.spriteKey,
                position: { x: pointer.worldX, y: pointer.worldY }
            });
        } else {
            EventBus.emit(DnDEvents.DragCancel, this.payload);
        }

        this.cancel();
    }

    private isPointerOverCanvas(_: Phaser.Input.Pointer): boolean {
        return true;
    }

    public cancel(): void {
        this.payload = null;
        if (this.preview) {
            this.preview.destroy();
            this.preview = null;
        }
    }

    public destroy(): void {
        this.scene.input.off(PointerEvents.PointerMove, this.handlePointerMove, this);
        this.scene.input.off(PointerEvents.PointerUp, this.handlePointerUp, this);
        this.cancel();
    }
}
