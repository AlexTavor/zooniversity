import { GameDisplayContext } from "../../GameDisplay.ts";
import { DisplayModule } from "../../setup/DisplayModule.ts";
import { TimeComponent } from "../../../logic/time/TimeComponent.ts";
import { TimeConfig } from "../../../config/TimeConfig.ts";
import { getColorForMinute } from "../time_tint/getColorForMinute.ts";
import { Config } from "../../../config/Config.ts";
import { WeatherComponent } from "../../../logic/weather/WeatherComponent.ts";

interface CloudLayerConfig {
    speed: number;
    preferredSprites: { key: string; weight: number }[];
    tintOffset: number;
    yOffset: number;
    ySpread: number;
    baseDensity: number;
    scaleMin: number;
    scaleMax: number;
    direction: 1 | -1;
}

interface CloudEntry {
    sprite: Phaser.GameObjects.Image;
    layerIndex: number;
}

export const CLOUD_TINT_GRADIENT: [number, number][] = [
    [0.0, 0x445566],
    [0.375, 0xf8f8ff],
    [0.5, 0xffffff],
    [0.875, 0xf8f8ff],
    [1.0, 0x445566],
];

function createCloudLayer(overrides: Partial<CloudLayerConfig>): CloudLayerConfig {
    return {
        speed: 0.5,
        preferredSprites: [{ key: "cloud0", weight: 1 }],
        tintOffset: 0.0,
        yOffset: 0,
        ySpread: 1200,
        baseDensity: 20,
        scaleMin: 1.0,
        scaleMax: 3.0,
        direction: 1,
        ...overrides,
    };
}

const CLOUD_LAYERS: CloudLayerConfig[] = [
    createCloudLayer({
        speed: 0.2,
        preferredSprites: [{ key: "cloud1", weight: 3 }, { key: "cloud0", weight: 1 }],
        tintOffset: 0,
        yOffset: 300,
    }),
    createCloudLayer({
        speed: 0.4,
        preferredSprites: [{ key: "cloud3", weight: 2 }, { key: "cloud0", weight: 2 }],
        tintOffset: 0.05,
        yOffset: 1200,
    }),
    createCloudLayer({
        speed: 0.8,
        preferredSprites: [{ key: "cloud0", weight: 4 }],
        tintOffset: 0.1,
        yOffset: 2200,
    }),
];

export class CloudsModule extends DisplayModule<GameDisplayContext> {
    private worldEntity!: number;
    private context!: GameDisplayContext;
    private containers: Phaser.GameObjects.Container[] = [];
    private cloudsByLayer: CloudEntry[][] = [];
    private outThreshold = 1000;
    private sceneWidth = 0;

    init(context: GameDisplayContext): void {
        this.context = context;
        const { scene, ecs, layers } = context;
        this.worldEntity = ecs.getEntitiesWithComponent(TimeComponent)[0];
        this.sceneWidth = scene.scale.width * 2 * Config.Camera.MaxZoom;

        CLOUD_LAYERS.forEach((layer, index) => {
            const container = scene.add.container();
            container.setDepth(-925 + index);
            layers.Sky.add(container);

            const clouds: CloudEntry[] = [];
            const spacing = this.sceneWidth / layer.baseDensity;
            const phaseOffset = (index / CLOUD_LAYERS.length) * spacing;

            for (let i = 0; i < layer.baseDensity; i++) {
                const sprite = this.spawnCloud(layer, scene);

                // Phase offset prevents same x positions between layers
                sprite.x = (i * spacing + phaseOffset) % this.sceneWidth;

                sprite.y = layer.yOffset + (Math.random() - 0.5) * layer.ySpread;
                container.add(sprite);
                clouds.push({ sprite, layerIndex:index });
            }


            this.containers.push(container);
            this.cloudsByLayer.push(clouds);
        });
    }

    update(delta: number): void {
        const { ecs } = this.context;
        const time = ecs.getComponent(this.worldEntity, TimeComponent);
        const weather = ecs.getComponent(this.worldEntity, WeatherComponent);

        const total = TimeConfig.HoursPerDay * TimeConfig.MinutesPerHour;
        const minute = time.hour * TimeConfig.MinutesPerHour + time.minute;
        const speedFactor = time.speedFactor ?? 1;
        const cloudCover = weather.cloudCover ?? 1;
        const windDir = weather.windDirection ?? 1;
        const effectiveSpeed = (weather.windStrength / TimeConfig.MinutesPerHour) * speedFactor * windDir;

        CLOUD_LAYERS.forEach((layer, layerIndex) => {
            this.updateLayer(layer, layerIndex, cloudCover, effectiveSpeed, windDir, minute, total, delta, speedFactor);
        });
    }

    private updateLayer(
        layer: CloudLayerConfig,
        layerIndex: number,
        cloudCover: number,
        effectiveSpeed: number,
        windDir: 1 | -1,
        minute: number,
        total: number,
        delta: number,
        speedFactor: number
    ) {
        const clouds = this.cloudsByLayer[layerIndex];
        const targetCount = Math.floor(layer.baseDensity * cloudCover);

        let activeCount = 0;

        for (let i = 0; i < clouds.length; i++) {
            const { sprite } = clouds[i];

            const becameVisible = this.updateCloud(
                sprite,
                activeCount < targetCount,
                layer,
                layerIndex,
                effectiveSpeed,
                windDir,
                minute,
                total,
                delta,
                speedFactor
            );

            if (becameVisible) {
                activeCount++;
            }
        }
    }

    private updateCloud(
        sprite: Phaser.GameObjects.Image,
        canBeActive: boolean,
        layer: CloudLayerConfig,
        layerIndex: number,
        effectiveSpeed: number,
        windDir: 1 | -1,
        minute: number,
        total: number,
        delta: number,
        speedFactor: number
    ): boolean {
        let becameVisible = false;

        // Move always
        sprite.x += (delta * 0.01 * effectiveSpeed);

        // Drift
        const drift = Math.sin(sprite.x * 0.00025 + layerIndex) * 0.05 * speedFactor;
        sprite.y -= drift;

        const outLeft = sprite.x < -this.outThreshold;
        const outRight = sprite.x > this.sceneWidth + this.outThreshold;
        const isOut = outLeft || outRight;

        if (isOut) {
            if (canBeActive) {
                // Re-enter
                const baseOffset = layerIndex * 20;
                const jitter = (Math.random() - 0.5) * 30;
                const offset = baseOffset + jitter;

                sprite.x = windDir === 1
                    ? -this.outThreshold + offset
                    : this.sceneWidth + this.outThreshold - offset;

                sprite.y = layer.yOffset + (Math.random() - 0.5) * layer.ySpread;

                if (!sprite.visible) {
                    sprite.setVisible(true);
                    becameVisible = true;
                }
            } else {
                sprite.setVisible(false);
            }
        } else if (!sprite.visible && canBeActive && this.shouldReenter(sprite, windDir)) {
            sprite.setVisible(true);
            becameVisible = true;
        }

        // Tint always
        const adjusted = (minute + layer.tintOffset * total) % total;
        sprite.setTint(getColorForMinute(adjusted, total, CLOUD_TINT_GRADIENT));

        return sprite.visible && becameVisible;
    }


    private shouldReenter(sprite: Phaser.GameObjects.Image, windDir: 1 | -1): boolean {
        const halfWidth = sprite.displayWidth / 2;

        if (windDir === 1) {
            // Entering from left → right
            const rightEdge = sprite.x + halfWidth;
            return rightEdge >= 0 && rightEdge <= this.outThreshold;
        } else {
            // Entering from right → left
            const leftEdge = sprite.x - halfWidth;
            return leftEdge <= this.sceneWidth && leftEdge >= this.sceneWidth - this.outThreshold;
        }
    }


    destroy(): void {
        this.cloudsByLayer.flat().forEach(c => c.sprite.destroy());
        this.containers.forEach(c => c.destroy());
        this.cloudsByLayer = [];
        this.containers = [];
    }

    private spawnCloud(layer: CloudLayerConfig, scene: Phaser.Scene): Phaser.GameObjects.Image {
        const spriteKey = this.chooseWeighted(layer.preferredSprites);
        const sprite = scene.add.image(0, 0, spriteKey);
        const scale = Phaser.Math.FloatBetween(layer.scaleMin, layer.scaleMax);
        sprite.setAlpha(0.8);
        sprite.setScale(scale);
        sprite.y = layer.yOffset + (Math.random() - 0.5) * layer.ySpread;
        return sprite;
    }

    private chooseWeighted(prefs: { key: string; weight: number }[]): string {
        const total = prefs.reduce((sum, p) => sum + p.weight, 0);
        let r = Math.random() * total;
        for (const p of prefs) {
            if (r < p.weight) return p.key;
            r -= p.weight;
        }
        return prefs[0].key;
    }
}
