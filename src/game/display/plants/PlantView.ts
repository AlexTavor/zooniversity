import {Config} from "../../config/Config.ts";
import {GameDisplay} from "../GameDisplay.ts";
import {MathUtils, Pos} from "../../../utils/Math.ts";

export class PlantView {
    sprite: Phaser.GameObjects.Sprite;
    private scene: Phaser.Scene;
    private readonly selectedPlantKey: string;
    private readonly idleAnimationKey: string;
    private idleTimer?: Phaser.Time.TimerEvent;
    private isDestroyed: boolean = false;

    private static plantWeights: { [key: string]: number } = {
        'tree0': 50,
        'tree1': 40,
        'tree2': 30,
        'tree3': 30,
        'tree4': 20,
        'tree5': 20,
        'bush0': 0,
        'bush1': 0
    };

    static initAnimations(scene: Phaser.Scene): void {
        for (let i = 0; i < Config.AnimImports.NumberOfTrees; i++) {
            const key = `tree${i}`;
            // Check if animation already exists to prevent errors on scene restart etc.
            if (!scene.anims.exists(key)) {
                this.createAnim(scene, key);
            }
        }

        // Create animations for bushes
        for (let i = 0; i < Config.AnimImports.NumberOfBushes; i++) {
            const key = `bush${i}`;
            // Check if animation already exists
            if (!scene.anims.exists(key)) {
                this.createAnim(scene, key);
            }
        }
    }

    static createAnim(scene: Phaser.Scene, key:string):void{
        scene.anims.create({
            key: key,
            frames: scene.anims.generateFrameNumbers(key, {start: 0, end: 3}),
            frameRate: 4,
            repeat: 1
        });
    }

    constructor(display: GameDisplay, public id:number, public pos:Pos = {x:0, y:0}) {
        this.scene = display.scene;

        // 1. Select plant type using weighted random
        this.selectedPlantKey = MathUtils.weightedRandString(PlantView.plantWeights);
        // Assuming animation key convention: e.g., 'tree0' for 'tree0' spritesheet
        this.idleAnimationKey = `${this.selectedPlantKey}`;

        // 2. Create the sprite using the selected key
        this.sprite = this.scene.add.sprite(pos.x, pos.y, this.selectedPlantKey);

        // Add to the specified layer/group
        if (display.layers && display.layers.Plants) {
            display.layers.Plants.add(this.sprite);
        } else {
            console.warn('display.layers.Plants not found for PlantView');
        }

        this.sprite.setOrigin(0.5, 0.5); // Example: origin at bottom center

        // Set random frame
        const randomFrame = Phaser.Math.Between(0, Config.AnimImports.NumberOfFrames - 1);
        this.sprite.setFrame(randomFrame);
        
        // // Check if the animation actually exists before trying to play it
        // if (!this.scene.anims.exists(this.idleAnimationKey)) {
        //     console.warn(`Animation key "${this.idleAnimationKey}" not found for plant key "${this.selectedPlantKey}"`);
        //     // Optionally default to frame 0 or hide sprite if animation is required
        //     this.sprite.setFrame(0);
        //     this.idleAnimationKey = ''; // Prevent trying to play non-existent anim
        // } else {
        //     // 3. Schedule the first idle animation attempt
        //     this.scheduleNextIdleAnimation(Phaser.Math.Between(5000, 30000)); // Start after 5-30 seconds initially
        // }
        
        // Optional: Link this PlantView instance to the sprite's data for interaction
        // this.sprite.setData('plantViewRef', this);
        // this.sprite.setInteractive(); // If plants can be clicked/selected
    }

    private scheduleNextIdleAnimation(delay: number): void {
        if (this.isDestroyed || !this.idleAnimationKey) return; // Don't schedule if destroyed or no valid anim

        // Remove existing timer if any
        if (this.idleTimer) {
            this.idleTimer.remove();
        }

        // Create a delayed call for the next animation
        this.idleTimer = this.scene.time.delayedCall(delay, this.triggerIdleAnimation, [], this);
    }

    private triggerIdleAnimation(): void {
        if (this.isDestroyed || !this.sprite?.active || !this.idleAnimationKey) return;

        // Play the idle animation (assuming it plays once - repeat: 0)
        this.sprite.play(this.idleAnimationKey);

        // When the animation completes, schedule the next one
        this.sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            // Calculate next delay (e.g., 20-40 seconds, averaging 30)
            const nextDelay = 30000 + Phaser.Math.Between(-10000, 10000);
            this.scheduleNextIdleAnimation(nextDelay);
        });
    }

    destroy(): void {
        this.sprite.destroy();
    }

    update(){
        // this.sprite.setDepth(this.pos.y + this.sprite.height/2);
    }
}
