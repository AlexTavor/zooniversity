import { TimeComponent } from "../../logic/time/TimeComponent.ts";
import { GameDisplayContext } from "../GameDisplay.ts";
import { Entity } from "../../ECS.ts";
import { DisplayModule } from "../setup/DisplayModule.ts";
import { TimeConfig } from "../../config/TimeConfig.ts";
import { Config } from "../../config/Config.ts";
import {
    getColorForMinute,
    SKY_TINT_GRADIENT,
} from "../time_tint/getColorForMinute.ts";
import { getWorldEntity } from "../../logic/serialization/getWorldEntity.ts";

export class SkyDisplayModule extends DisplayModule<GameDisplayContext> {
    private background!: Phaser.GameObjects.Rectangle;
    private worldEntity!: Entity;
    private context!: GameDisplayContext;
    init(context: GameDisplayContext): void {
        this.context = context;
        const { scene, ecs } = context;

        this.worldEntity = getWorldEntity(ecs);
        const w = scene.scale.width * Config.Camera.MaxZoom + 200;
        const h = scene.scale.height * Config.Camera.MaxZoom + 200;
        this.background = scene.add
            .rectangle(0, 0, w, h, 0x000000)
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0)
            .setDepth(-1000);

        context.layers.Sky.add(this.background);

        scene.scale.on("resize", () => {
            this.background.setSize(scene.scale.width, scene.scale.height);
        });
    }

    update(_: number): void {
        const time = this.context.ecs.getComponent(
            this.worldEntity,
            TimeComponent,
        );

        if (!time) {
            return;
        }

        const minutesInDay = TimeConfig.HoursPerDay * TimeConfig.MinutesPerHour;
        const currentMinute =
            time.hour * TimeConfig.MinutesPerHour + time.minute;

        const color = getColorForMinute(
            currentMinute,
            minutesInDay,
            SKY_TINT_GRADIENT,
        );
        this.background.setFillStyle(color, 1);
    }

    destroy(): void {
        this.background?.destroy();
    }
}
