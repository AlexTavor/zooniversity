export type ClickCallback = (pointer: Phaser.Input.Pointer) => void;

export class ClickThresholdHandler {
  private threshold: number;
  private downPos: Phaser.Math.Vector2 | null = null;
  private scene: Phaser.Scene;
  private onClick: ClickCallback;

  constructor(scene: Phaser.Scene, onClick: ClickCallback, threshold = 5) {
    this.scene = scene;
    this.onClick = onClick;
    this.threshold = threshold;
  }

  start(): void {
    this.scene.input.on('pointerdown', this.onPointerDown, this);
    this.scene.input.on('pointerup', this.onPointerUp, this);
  }

  stop(): void {
    this.scene.input.off('pointerdown', this.onPointerDown, this);
    this.scene.input.off('pointerup', this.onPointerUp, this);
  }

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    this.downPos = pointer.position.clone();
  }

  private onPointerUp(pointer: Phaser.Input.Pointer): void {
    if (!this.downPos) return;

    const upPos = pointer.position;
    const distance = Phaser.Math.Distance.BetweenPoints(this.downPos, upPos);
    this.downPos = null;

    if (distance <= this.threshold) {
      this.onClick(pointer);
    }
  }
}
