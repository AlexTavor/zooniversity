import {DisplayModule} from "../../setup/DisplayModule.ts";
import {GameDisplayContext} from "../../GameDisplay.ts";
import {Entity} from "../../../ECS.ts";
import {WeatherComponent} from "../../../logic/weather/WeatherComponent.ts";
import {TimeComponent} from "../../../logic/time/TimeComponent.ts";
import {SimplexNoise} from "../../../../utils/SimplexNoise.ts";
import {ViewType} from "../../setup/ViewDefinition.ts";
import { getWorldEntity } from "../../../logic/serialization/getWorldEntity.ts";

export class TreeSwayConfig {
    public static MaxRotation = Phaser.Math.DegToRad(6);
    public static SpatialFrequency = 0.001;
    public static TimeSpeed = 0.001;
}

export class TreeSwayModule extends DisplayModule<GameDisplayContext> {
    private context!: GameDisplayContext;
    private worldEntity!: Entity;
    private time = 0;
    private simplex = new SimplexNoise();

    init(context: GameDisplayContext): void {
        this.context = context;
        this.worldEntity = getWorldEntity(context.ecs);
    }

    update(delta: number): void {
        this.time += delta;
        const { ecs, viewsByEntity } = this.context;

        const timeComp = ecs.getComponent(this.worldEntity, TimeComponent);
        const weather = ecs.getComponent(this.worldEntity, WeatherComponent);

        const windStrength = Phaser.Math.Clamp(weather.windStrength ?? 0, 0, 1000) / 1000;
        const speedFactor = timeComp.speedFactor ?? 1;

        const t = this.time * TreeSwayConfig.TimeSpeed * speedFactor;
        const { SpatialFrequency: freq, MaxRotation: maxAngle } = TreeSwayConfig;

        for (const [entity, view] of viewsByEntity) {
            if (view.type !== ViewType.TREE) continue;

            const sprite = view.viewContainer;

            const sway = this.simplex.noise3D(
                sprite.x * freq,
                sprite.y * freq,
                t + entity * 1000 // phase offset by entity ID
            );

            sprite.rotation = sway * maxAngle * windStrength;
        }
    }


    destroy(): void {
        // Clean up if necessary
        this.context = null!;
        this.worldEntity = null!;
    }
}