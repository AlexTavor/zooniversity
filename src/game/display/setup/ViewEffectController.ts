import { View } from "./View";
import {
    ProgressBarEffect,
    ProgressBarConfig,
} from "../effects/ProgressBarEffect";
import { ShudderEffect, ShudderEffectConfig } from "../effects/ShudderEffect";
import {
    ForagableEffect,
    ForagableEffectConfig,
} from "../effects/ForagableEffect";
import {
    SelectionOutlineEffect,
    SelectionOutlineEffectOptions,
} from "../effects/SelectionOutlineEffect";

export interface EffectInstance {
    start(): void;
    stop(): void;
    update?(delta: number): void;
    destroy?(): void; // Optional destroy method for effects that create persistent objects
}

export enum EffectType {
    Red = "red",
    Highlight = "highlight", // Currently same as Red
    Shader = "shader",
    Shake = "shake",
    Progress = "progress",
    Shudder = "shudder",
    FORAGABLE = "foragable",
}

// Ensure ProgressBarOptions matches if it was defined elsewhere, or use ProgressBarConfig directly
export type ProgressBarOptions = ProgressBarConfig & {
    container: Phaser.GameObjects.Container;
};

export class ViewEffectController {
    private readonly view: View;
    private readonly active: Map<EffectType, EffectInstance> = new Map();

    constructor(view: View) {
        this.view = view;
    }

    public apply(type: EffectType, opts?: any): void {
        if (this.active.has(type)) {
            return;
        }

        let instance: EffectInstance | undefined;

        switch (type) {
            case EffectType.Red:
                instance = this.makeRed(opts);
                break;
            case EffectType.Highlight:
                instance = this.makeHighlight(opts); // Assuming Highlight is same as Red for now
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
            case EffectType.Shudder:
                instance = new ShudderEffect(
                    this.view,
                    opts as ShudderEffectConfig,
                );
                break;
            case EffectType.FORAGABLE:
                instance = this.makeForagableDisplay(
                    opts as ForagableEffectConfig,
                );
                break;
        }

        if (instance) {
            this.active.set(type, instance);
            instance.start();
        }
    }

    private makeHighlight(
        opts: SelectionOutlineEffectOptions,
    ): EffectInstance | undefined {
        if (!this.view) return undefined;
        return new SelectionOutlineEffect(this.view, opts);
    }

    public clear(type: EffectType): void {
        const effect = this.active.get(type);
        if (effect) {
            effect.stop();
            effect.destroy?.(); // Call destroy if it exists
            this.active.delete(type);
        }
    }

    public clearAll(): void {
        for (const effect of this.active.values()) {
            effect.stop();
            effect.destroy?.();
        }
        this.active.clear();
    }

    public update(delta: number): void {
        for (const effect of this.active.values()) {
            effect.update?.(delta);
        }
    }

    private makeShake(opts?: Record<string, any>): EffectInstance {
        const sprite = this.view.getSprite?.();
        if (!sprite) return { start: () => {}, stop: () => {} };
        const tween = sprite.scene.tweens.add({
            targets: sprite,
            scale: {
                from: sprite.scale,
                to: sprite.scale * (opts?.scaleFactor ?? 1.15),
            }, // Use scaleFactor
            yoyo: true,
            duration: opts?.duration ?? 200,
            repeat: opts?.repeat ?? 0,
        });
        return {
            start: () => {
                if (sprite.active) tween.play();
            },
            stop: () => tween.stop(),
            destroy: () => tween.remove(),
        };
    }

    private makeRed(opts?: Record<string, any>): EffectInstance {
        const sprite = this.view.getSprite?.();
        if (!sprite) return { start: () => {}, stop: () => {} };
        const tint = opts?.color ?? 0xff0000;
        let originalTint: number | undefined;
        let isTinted: boolean = false;

        return {
            start: () => {
                if (sprite.isTinted) {
                    originalTint = sprite.tintTopLeft; // Assuming uniform tint
                } else {
                    originalTint = undefined;
                }
                sprite.setTint(tint);
                isTinted = true;
            },
            stop: () => {
                if (isTinted) {
                    if (originalTint !== undefined) {
                        sprite.setTint(originalTint);
                    } else {
                        sprite.clearTint();
                    }
                    isTinted = false;
                }
            },
        };
    }

    private makeShader(opts?: Record<string, any>): EffectInstance {
        const sprite = this.view.getSprite?.();
        if (!sprite) return { start: () => {}, stop: () => {} };
        const shaderName = opts?.shader ?? "TimeTint";
        return {
            start: () => sprite.setPipeline(shaderName),
            stop: () => sprite.resetPipeline(), // Or setPipeline() to remove custom one
        };
    }

    private makeProgress(config: ProgressBarOptions): EffectInstance {
        const bar = new ProgressBarEffect(config.container, config);
        return {
            start: bar.show.bind(bar),
            stop: bar.hide.bind(bar),
            update: (delta: number) =>
                bar.update(delta, this.view.viewDefinition.position),
            destroy: bar.destroy.bind(bar),
        };
    }

    private makeForagableDisplay(
        config: ForagableEffectConfig,
    ): EffectInstance {
        const foragableEffect = new ForagableEffect(this.view, config);
        return {
            start: foragableEffect.start.bind(foragableEffect),
            stop: foragableEffect.stop.bind(foragableEffect),
            update: foragableEffect.update.bind(foragableEffect),
            destroy: foragableEffect.destroy.bind(foragableEffect),
        };
    }
}
