import {GameDisplayContext} from "../GameDisplay.ts";
import {DisplayModule} from "../setup/DisplayModule.ts";
import {TimeComponent} from "../../logic/time/TimeComponent.ts";
import {TimeConfig} from "../../config/TimeConfig.ts";
import {Config} from "../../config/Config.ts";
import { getWorldEntity } from "../../logic/serialization/getWorldEntity.ts";

export class StarfieldModule extends DisplayModule<GameDisplayContext> {
    private starContainer!: Phaser.GameObjects.Container;
    private starBackground!: Phaser.GameObjects.Image;
    private stars: Phaser.GameObjects.Graphics[] = [];
    private starOffsets: number[] = [];
    private worldEntity!: number;
    private starCount = 120;
    private scene!: Phaser.Scene;
    private context!: GameDisplayContext;
    private center!: Phaser.Math.Vector2;

    init(context: GameDisplayContext): void {
        this.context = context;
        const { scene, layers, ecs } = context;
        this.scene = scene;

        this.worldEntity = getWorldEntity(ecs);

        const camera = scene.cameras.main;
        const width = camera.width * Config.Camera.MaxZoom;
        const height = camera.height * Config.Camera.MaxZoom;

        this.center = new Phaser.Math.Vector2(camera.scrollX + width / 2, camera.scrollY + height / 3);

        // Main container centered in the sky
        this.starContainer = scene.add.container(this.center.x, this.center.y);
        this.starContainer.setDepth(-950);
        layers.Sky.add(this.starContainer);

        // Milky Way background image (rotates with stars)
        this.starBackground = scene.add.image(0, 0, 'night_sky');
        this.starBackground.setOrigin(0.5);
        this.starBackground.setAlpha(0.6);
        this.starBackground.setScale(13); // Adjust scale if needed
        this.starContainer.add(this.starBackground);

        // Add twinkling stars in front
        for (let i = 0; i < this.starCount; i++) {
            const g = scene.add.graphics();
            g.fillStyle(0xffffff, 1);

            const radius = Math.random() * width * 0.6;
            const angle = Math.random() * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const r = Math.random() * 2.5 + .5;

            g.fillCircle(0, 0, r);
            g.x = x;
            g.y = y;

            this.starContainer.add(g);
            this.stars.push(g);
            this.starOffsets.push(angle);
        }
    }

    update(): void {
        const time = this.context.ecs.getComponent(this.worldEntity, TimeComponent);
        const total = TimeConfig.HoursPerDay * TimeConfig.MinutesPerHour;
        const currentMinute = time.hour * TimeConfig.MinutesPerHour + time.minute;
        const baseAlpha = getNightAlpha(currentMinute, total);
        const zoom = this.scene.cameras.main.zoom;
        const timeSec = this.scene.time.now / 1000;

        // Rotate full circle over the day
        const t = currentMinute / total;
        this.starContainer.rotation = t * Math.PI * 2;

        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i];
            const offset = this.starOffsets[i];
            const twinkle = 0.85 + 0.15 * Math.sin(timeSec * 12 + offset) * Math.sin(timeSec * 7 + offset * 1.3);

            star.setAlpha(baseAlpha * twinkle);
            star.setScale(1 / zoom); // visual size constant
        }

        // Fade background in/out with stars
        this.starBackground.setAlpha(baseAlpha * 0.6);
    }

    destroy(): void {
        for (const star of this.stars) {
            star.destroy();
        }
        this.stars = [];
        this.starOffsets = [];

        this.starBackground?.destroy();
        this.starContainer?.destroy();
    }
}

function getNightAlpha(minute: number, total: number): number {
    const t = (minute % total) / total;

    if (t < 0.25 || t > 0.875) return 1; // full night
    if (t < 0.375) return 1 - (t - 0.25) * 8; // fade out at dawn
    if (t > 0.75) return (t - 0.75) * 8;      // fade in at dusk

    return 0;
}

