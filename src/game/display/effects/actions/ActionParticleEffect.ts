import { Config } from "../../../config/Config";
import { Pos } from "../../../../utils/Math";
import { View } from "../../setup/View";
import { EffectInstance } from "../../setup/ViewEffectController";

export interface ActionParticleEffectConfig {
    container: Phaser.GameObjects.Container; // Container to add to
    config: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig; // Emitter config
    emitFreq: number; // How often to emit
    emitQuantity?: number; // How much to emit each time
    emitArea?: Pos;
}

export class ActionParticleEffect implements EffectInstance {
    //--- Fields for configuration and state ---
    private readonly view: View;
    private readonly emitter: Phaser.GameObjects.Particles.ParticleEmitter;
    private readonly camera: Phaser.Cameras.Scene2D.Camera;
    private timer = 0;
    private emitFreq = 100;
    private emitQuantity = 1;
    private isRunning = false;

    //--- Fields for scaling logic ---
    private readonly maxScaleMultiplier: number = 2; // The max scale when fully zoomed out
    private readonly normalZoomLevel: number = 1.0; // The zoom level considered "normal"

    constructor(view: View, config: ActionParticleEffectConfig) {
        this.view = view;
        this.camera = view.sprite.scene.cameras.main;

        this.emitter = view.sprite.scene.add.particles(
            0,
            0,
            "plants",
            config.config,
        );

        config.container.add(this.emitter);

        this.emitFreq = config.emitFreq;
        if (config.emitQuantity) {
            this.emitQuantity = config.emitQuantity;
        }
    }

    public start(): void {
        this.isRunning = true;
        this.timer = 0;
    }

    public stop(): void {
        this.isRunning = false;
        this.timer = 0;
    }

    public update(delta: number): void {
        if (!this.isRunning) {
            return;
        }

        // --- Particle Scaling Logic (Refactored) ---
        const currentZoom = this.camera.zoom;
        let scaleMultiplier: number;

        if (currentZoom < this.normalZoomLevel) {
            // When zoomed out, interpolate from the max scale down to normal (1x)
            const progress = Phaser.Math.Percent(
                currentZoom,
                Config.Camera.MinZoom,
                this.normalZoomLevel,
            );
            scaleMultiplier = Phaser.Math.Linear(
                this.maxScaleMultiplier,
                1,
                progress,
            );
        } else {
            // When zoomed in, use inverse scaling for a consistent apparent size
            scaleMultiplier = 1 / currentZoom;
        }

        // Clamp the final value and set the scale for newly emitted particles
        const finalScale = Phaser.Math.Clamp(
            scaleMultiplier,
            1 / Config.Camera.MaxZoom,
            this.maxScaleMultiplier,
        );
        this.emitter.setScale(finalScale);
        // --- End of Scaling Logic ---

        // Update emitter position to follow the view's container
        this.emitter.x = this.view.viewContainer.x;
        this.emitter.y = this.view.viewContainer.y;

        // Update timer and emit particles when needed
        this.timer += delta;
        if (this.timer >= this.emitFreq) {
            this.timer -= this.emitFreq;
            this.emitter.emitParticle(this.emitQuantity);
        }
    }

    public destroy(): void {
        this.emitter.destroy();
    }
}
