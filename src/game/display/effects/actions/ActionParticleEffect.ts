import { View } from "../../setup/View";
import { EffectInstance } from "../../setup/ViewEffectController";

export interface ActionParticleEffectConfig {
    container: Phaser.GameObjects.Container; // Container to add to
    config: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig; // Emitter config
    emitFreq: number; // How often to emit
    emitQuantity?: number; // How much to emit each time
}

/*
Example: {
        frame: ["eat_icon"],
        lifespan: 1000,
        speed: { min: 200, max: 350 },
        scale: { start: 5, end: 0 },
        // rotate: { start: 0, end: 360 },
        gravityY: 20,
        gravityX: 20,
        emitting: false,
    }
*/

export class ActionParticleEffect implements EffectInstance {
    private view: View;
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
    private timer = 0;
    private emitFreq = 100; // Time in ms between emissions
    private emitQuantity = 1; // Particles to emit each time
    private isRunning = false;

    constructor(view: View, config: ActionParticleEffectConfig) {
        this.view = view;

        this.emitter = view.sprite.scene.add.particles(
            0,
            0,
            "plants",
            config.config,
        );

        config.container.add(this.emitter);

        this.emitFreq = config.emitFreq;
    }

    public start(): void {
        // Start timer
        this.isRunning = true;
        this.timer = 0; // Reset timer to emit immediately on the first update
    }

    public stop(): void {
        // Stop and reset timer
        this.isRunning = false;
        this.timer = 0;
    }

    public update(delta: number): void {
        if (!this.isRunning) {
            return;
        }

        this.emitter.x = this.view.viewContainer.x;
        this.emitter.y = this.view.viewContainer.y;

        // Update timer. Emit when needed.
        this.timer += delta;
        if (this.timer >= this.emitFreq) {
            this.timer -= this.emitFreq;
            this.emitter.emitParticle(this.emitQuantity);
        }
    }

    /**
     * Cleans up the particle emitter from the scene.
     */
    public destroy(): void {
        this.emitter.destroy();
    }
}
