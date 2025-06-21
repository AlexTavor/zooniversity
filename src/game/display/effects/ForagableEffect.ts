// src/game/display/game/effects/AppleQuantityEffect.ts
import Phaser from "phaser";
import { View } from "../setup/View"; // Adjust path
import { EffectInstance } from "../setup/ViewEffectController"; // Adjust path
import { Pos } from "../../../utils/Math"; // Adjust path
import { ValueRef } from "./ProgressBarEffect"; // Assuming ValueRef is in ProgressBar.ts or a common types file

export interface ForagableEffectConfig {
    valueRef: ValueRef; // Holds current and max foragable amount
    spriteKey: string; // Sprite key for the apple/fruit
    maxSprites: number; // Max number of apple sprites to display
    unitsPerSprite: number; // How many 'currentAmount' units one visual apple represents
    fixedRelativePositions: Pos[]; // Pre-calculated positions for each of the maxSprites
    initialVisible?: boolean;
    spriteScale?: number;
}

export class ForagableEffect implements EffectInstance {
    private view: View;
    private config: Required<ForagableEffectConfig>; // Use Required to ensure all defaults are handled
    private sprites: Phaser.GameObjects.Sprite[] = [];
    private lastVisibleCount: number = -1;

    constructor(view: View, config: ForagableEffectConfig) {
        this.view = view;
        // Apply defaults to the configuration
        this.config = {
            initialVisible: true,
            spriteScale: 0.15, // Example default scale for small apple sprites
            ...config,
        };
    }

    public start(): void {
        if (this.sprites.length > 0) {
            // Already initialized
            this.updateVisibility();
            return;
        }

        const container = this.view.viewContainer;
        const scene = container.scene;
        for (let i = 0; i < this.config.maxSprites; i++) {
            const pos = this.config.fixedRelativePositions[i] || { x: 0, y: 0 }; // Fallback position
            const appleSprite = scene.add.sprite(
                pos.x,
                pos.y,
                "plants",
                "foragable_item",
            );
            appleSprite.setScale(this.config.spriteScale);
            appleSprite.setOrigin(0.5, 0.5); // Or adjust as needed
            appleSprite.setVisible(false); // Initially hide all
            container.add(appleSprite); // Add to the specified container
            this.sprites.push(appleSprite);
        }
        this.updateVisibility(); // Set initial visibility based on current value
    }

    public stop(): void {
        this.sprites.forEach((sprite) => sprite.setVisible(false)); // Hide on stop
        this.lastVisibleCount = -1; // Reset last count
    }

    public update(_delta: number): void {
        this.updateVisibility();
    }

    private updateVisibility(): void {
        if (!this.config.valueRef || this.config.unitsPerSprite <= 0) return;

        const currentAmount = this.config.valueRef.current;
        let numApplesToShow = 0;
        if (currentAmount > 0) {
            numApplesToShow = Math.min(
                this.config.maxSprites,
                Math.ceil(currentAmount / this.config.unitsPerSprite),
            );
        }

        if (numApplesToShow === this.lastVisibleCount) return; // No change in visibility

        for (let i = 0; i < this.sprites.length; i++) {
            this.sprites[i].setVisible(i < numApplesToShow);
        }
        this.lastVisibleCount = numApplesToShow;
    }

    // Call this if the effect instance is being permanently removed
    public destroy(): void {
        this.sprites.forEach((sprite) => sprite.destroy());
        this.sprites = [];
    }
}
