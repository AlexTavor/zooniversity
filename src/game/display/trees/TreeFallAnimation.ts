import Phaser from "phaser";

export interface TreeFallAnimationConfig {
    scene: Phaser.Scene;
    spriteKey: string;
    position: { x: number; y: number };
    size: { x: number; y: number };
    duration: number;
    direction?: number; // 1 or -1
    onComplete?: () => void;
    container?: Phaser.GameObjects.Container;
}

export class TreeFallAnimation {
    private sprite: Phaser.GameObjects.Sprite;
    private scene: Phaser.Scene;
    private tween: Phaser.Tweens.Tween;

    constructor(config: TreeFallAnimationConfig) {
        const {
            container,
            scene,
            spriteKey,
            position,
            size,
            duration,
            direction = Math.random() < 0.5 ? -1 : 1,
            onComplete,
        } = config;

        this.scene = scene;
        this.sprite = scene.add.sprite(
            position.x,
            position.y,
            "plants",
            spriteKey,
        );
        container?.add(this.sprite);
        this.sprite.setDisplaySize(size.x, size.y);
        this.sprite.setOrigin(0.5, 1);

        const offsetX = direction * 20;
        const rotation = direction * Phaser.Math.DegToRad(90);

        this.tween = scene.tweens.add({
            targets: this.sprite,
            x: position.x + offsetX,
            rotation: rotation,
            duration: duration,
            ease: "Sine.easeOut",
            onComplete: () => {
                onComplete?.();
            },
        });
    }

    setSpeed(speed: number): void {
        this.tween.timeScale = speed;
    }

    fadeOut(duration: number, onComplete?: () => void): void {
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            duration,
            ease: "Linear",
            onComplete: () => {
                this.sprite.destroy();
                onComplete?.();
            },
        });
    }
}
