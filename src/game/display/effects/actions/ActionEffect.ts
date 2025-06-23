import { CharacterAction } from "../../../logic/intent/intent-to-action/actionIntentData";
import { View } from "../../setup/View";
import { EffectInstance } from "../../setup/ViewEffectController";
import {
    ActionParticleEffect,
    ActionParticleEffectConfig,
} from "./ActionParticleEffect";

export interface ActionEffectConfig {
    container: Phaser.GameObjects.Container;
    // This object's `action` property will be updated externally to control the effect.
    currentActionRef: { action: CharacterAction | null };
}

export class ActionEffect implements EffectInstance {
    // A map to hold all possible particle emitters, indexed by the action that triggers them.
    private emitters: Map<CharacterAction, ActionParticleEffect> = new Map();
    private config: ActionEffectConfig;
    private lastAction: CharacterAction | null = null;

    constructor(view: View, config: ActionEffectConfig) {
        this.config = config;

        // --- Define Particle Configurations for each Action ---

        const choppingConfig: ActionParticleEffectConfig = {
            container: config.container,
            emitFreq: 600,
            emitQuantity: 2,
            config: {
                frame: ["axe_icon"],
                lifespan: 1600,
                speed: { min: 200, max: 400 },
                scale: { start: 3, end: 1 },
                rotate: { start: 0, end: 720 },
                angle: { min: -120, max: -60 },
                gravityY: 500,
                emitting: false,
            },
        };

        const sleepingConfig: ActionParticleEffectConfig = {
            container: config.container,
            emitFreq: 750,
            emitQuantity: 1,
            config: {
                frame: ["sleep_icon"],
                lifespan: 2500,
                speedY: { min: -40, max: -60 },
                speedX: { min: -15, max: 15 },
                scale: { start: 1, end: 3 },
                alpha: { start: 1, end: 0.1 },
                gravityY: -40, // Make them float up
                emitting: false,
            },
        };

        const foragingConfig: ActionParticleEffectConfig = {
            container: config.container,
            emitFreq: 350,
            emitQuantity: 2,
            config: {
                frame: ["forage_icon"],
                lifespan: 1200,
                speed: { min: 20, max: 50 },
                scale: { start: 3, end: 1 },
                alpha: { start: 1, end: 0.1 },
                x: { min: -100, max: 100 },
                y: { min: -100, max: 100 },
                gravityY: 80,
                emitting: false,
            },
        };

        const eatingConfig: ActionParticleEffectConfig = {
            container: config.container,
            emitFreq: 300,
            emitQuantity: 1,
            config: {
                frame: ["eat_icon"],
                lifespan: 1200,
                speedY: { min: -120, max: -60 },
                speedX: { min: -200, max: 200 },
                gravityY: 400,
                scale: { start: 3, end: 2 },
                alpha: { start: 1, end: 0.1 },
                emitting: false,
            },
        };

        // --- Initialize Emitters ---
        this.emitters.set(
            CharacterAction.CHOPPING,
            new ActionParticleEffect(view, choppingConfig),
        );
        this.emitters.set(
            CharacterAction.SLEEPING,
            new ActionParticleEffect(view, sleepingConfig),
        );
        this.emitters.set(
            CharacterAction.FORAGING,
            new ActionParticleEffect(view, foragingConfig),
        );
        this.emitters.set(
            CharacterAction.EATING,
            new ActionParticleEffect(view, eatingConfig),
        );
    }

    public start(): void {
        // When this effect controller starts, immediately activate the effect
        // for the current action.
        const currentAction = this.config.currentActionRef.action;
        if (currentAction) {
            this.emitters.get(currentAction)?.start();
            this.lastAction = currentAction;
        }
    }

    public stop(): void {
        // Stops all emitters managed by this controller.
        for (const emitter of this.emitters.values()) {
            emitter.stop();
        }
        this.lastAction = null;
    }

    public update(delta: number): void {
        const currentAction = this.config.currentActionRef.action;

        // This block efficiently manages which effect is active.
        // It only acts if the character's action has changed.
        if (currentAction !== this.lastAction) {
            // Stop the previously active emitter
            if (this.lastAction) {
                this.emitters.get(this.lastAction)?.stop();
            }

            // Start the new emitter
            if (currentAction) {
                this.emitters.get(currentAction)?.start();
            }

            this.lastAction = currentAction;
        }

        // IMPORTANT: Update all emitters every frame.
        // This ensures that even when an emitter is "stopped", its existing
        // particles can continue their lifecycle (e.g., fade out).
        for (const emitter of this.emitters.values()) {
            emitter.update(delta);
        }
    }

    public destroy(): void {
        // Cleans up all emitters when the effect controller is destroyed.
        for (const emitter of this.emitters.values()) {
            emitter.destroy();
        }
        this.emitters.clear();
    }
}
