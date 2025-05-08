import { ProgressBar, ProgressBarConfig } from "../game/effects/ProgressBar";
import { View } from "./View";

interface EffectInstance {
  start(): void;
  stop(): void;
  update?(delta: number): void;
}

export enum EffectType {
  Red = "red",
  Highlight = "highlight",
  Shader = "shader",
  Shake = "shake",
  Progress = "progress",
}

export type ProgressBarOptions = ProgressBarConfig & { container: Phaser.GameObjects.Container };

export class ViewEffectController {
  private readonly view: View;
  private readonly active: Map<EffectType, EffectInstance> = new Map();

  constructor(view: View) {
    this.view = view;
  }

  apply(type: EffectType, opts?: Record<string, any>): void {
    if (this.active.has(type)) return;

    let instance: EffectInstance | undefined;

    switch (type) {
      case EffectType.Red:
        instance = this.makeRed(opts);
        break;
      case EffectType.Highlight:
        instance = this.makeRed(opts);
        break;
      case EffectType.Shader:
        instance = this.makeShader(opts);
        break;
      case EffectType.Shake:
        instance = this.makeShake(opts);
        break;
      case EffectType.Progress:
        instance = this.makeProgress(opts as ProgressBarOptions);
        break;
    }

    if (instance) {
      this.active.set(type, instance);
      instance.start();
    }
  }

  clear(type: EffectType): void {
    const effect = this.active.get(type);
    if (effect) {
      effect.stop();
      this.active.delete(type);
    }
  }

  clearAll(): void {
    for (const effect of this.active.values()) {
      effect.stop();
    }
    this.active.clear();
  }

  update(delta: number): void {
    for (const effect of this.active.values()) {
      effect.update?.(delta);
    }
  }

  private makeShake(opts?: Record<string, any>): EffectInstance {
    const sprite = this.view.getSprite?.();
    if (!sprite) return { start: () => {}, stop: () => {} };

    const tween = sprite.scene.tweens.add({
      targets: sprite,
      scale: { from: 1, to: opts?.scale ?? 1.15 },
      yoyo: true,
      duration: opts?.duration ?? 200,
      repeat: opts?.repeat ?? 0,
    });

    return {
      start: () => {},
      stop: () => tween.stop(),
    };
  }

  private makeRed(opts?: Record<string, any>): EffectInstance {
    const sprite = this.view.getSprite?.();
    if (!sprite) return { start: () => {}, stop: () => {} };

    const tint = opts?.color ?? 0xff0000;

    return {
      start: () => sprite.setTint(tint),
      stop: () => sprite.clearTint(),
    };
  }

  private makeShader(opts?: Record<string, any>): EffectInstance {
    const sprite = this.view.getSprite?.();
    if (!sprite) return { start: () => {}, stop: () => {} };

    const shader = opts?.shader ?? "TimeTint";

    return {
      start: () => sprite.setPipeline(shader),
      stop: () => sprite.resetPipeline(),
    };
  }

  private makeProgress(config: ProgressBarOptions): EffectInstance {
    const bar = new ProgressBar(config.container, config);
  
    return {
      start: bar.show.bind(bar),
      stop: bar.hide.bind(bar),
      update: (delta: number) => bar.update(delta, this.view.viewDefinition.position)
    };
  }
}
