import { View } from "../setup/View";
import { EffectInstance } from "../setup/ViewEffectController";


export interface ShudderEffectConfig {
  interval: number;  // ms between shakes
  duration: number;  // ms shake duration
  strength: number;  // max shake distance in px
}

export class ShudderEffect implements EffectInstance {
  private sprite: Phaser.GameObjects.Sprite | undefined;
  private readonly interval: number;
  private readonly duration: number;
  private readonly strength: number;

  private timer = 0;
  private elapsed = 0;
  private isShaking = false;
  private originalX = 0;
  timeScale: number = 1;

  constructor(private view: View, config: ShudderEffectConfig) {
    this.sprite = view.getSprite?.();
    this.interval = config.interval;
    this.duration = config.duration;
    this.strength = config.strength;

    if (this.sprite) {
      this.originalX = this.sprite.x;
    }
  }

  start(): void {
    this.timer = 0;
    this.elapsed = 0;
    this.isShaking = false;
    if (this.sprite) {
      this.originalX = this.sprite.x;
    }
  }

  stop(): void {
    if (this.sprite) {
      this.sprite.x = this.originalX;
    }
  }

  setSpeed(speed: number): void {
    this.timeScale = speed;
  }
  
  update(delta: number): void {
    if (!this.sprite) return;

    this.timer += delta * this.timeScale;

    if (!this.isShaking && this.timer >= this.interval) {
      this.isShaking = true;
      this.elapsed = 0;
      this.timer = 0;
    }

    if (this.isShaking) {
      this.elapsed += delta;
      const t = Math.min(this.elapsed / this.duration, 1);
      const fade = 1 - t;

      this.sprite.x = this.originalX + (Math.random() - 0.5) * 2 * this.strength * fade;

      if (t >= 1) {
        this.sprite.x = this.originalX;
        this.isShaking = false;
      }
    }
  }
}
