import { System } from "../../ECS.ts";
import { Entity } from "../../ECS.ts";
import { WeatherComponent } from "./WeatherComponent.ts";
import {SimplexNoise} from "../../../utils/SimplexNoise.ts";
import {WeatherConfig} from "../../config/WeatherConfig.ts";
import {EventBus} from "../../EventBus.ts";
import {GameEvent} from "../../consts/GameEvents.ts";
import {TimeComponent} from "../time/TimeComponent.ts";

export class WeatherSystem extends System {
    componentsRequired = new Set<Function>([WeatherComponent, TimeComponent]);
    private noise = new SimplexNoise(1); // Seed for consistent variation
    private time = 0;

    update(entities: Set<Entity>, delta: number): void {
        if (entities.size === 0) return;
        if (entities.size > 1) {
            console.warn("WeatherSystem is not designed to handle multiple entities.");
        }
        for (const entity of entities) {
            this.updateWeather(entity, delta);
        }
    }
    
    updateWeather(entity: Entity, delta: number) {
        const weather = this.ecs.getComponent(entity, WeatherComponent);
        const time = this.ecs.getComponent(entity, TimeComponent);

        this.time += delta * time.speedFactor;

        // Wind Strength
        const t = this.time * WeatherConfig.Wind.StrengthFrequency;
        const windRaw = this.noise.noise(t, 0);             // [-1, 1]
        const windNorm = (windRaw + 1) / 2;                 // [0, 1]
        const biased = this.biasedSample(windNorm, WeatherConfig.Wind.Bias);

        weather.windStrength = Phaser.Math.Linear(
            WeatherConfig.Wind.MinSpeed,
            WeatherConfig.Wind.MaxSpeed,
            biased
        ); // Result in px/game-minute


        // Wind Direction
        const t1 = this.time * WeatherConfig.Wind.DirectionFrequency;
        const dirNoise = this.noise.noise(t1, 1000);
        weather.windDirection = dirNoise > WeatherConfig.Wind.DirectionThreshold ? 1 : -1;

        // Cloud Cover (Inverted Bell)
        const t2 = this.time * WeatherConfig.CloudCover.Frequency;
        const coverNoise = this.noise.noise(t2, WeatherConfig.CloudCover.NoiseOffset);
        const coverNorm = (coverNoise + 1) / 2;
        weather.cloudCover = Phaser.Math.Clamp(
            this.biasedSample(coverNorm, 1 - WeatherConfig.CloudCover.Bias),
            0,
            1
        );

        EventBus.emit(GameEvent.SetWeather, weather);
    }

    private biasedSample(x: number, bias: number): number {
        // bias ∈ [0, 1], where 0 = favor low, 1 = favor high
        const k = Math.max(0.0001, bias); // avoid log(0)
        return x / ((1 - k) / k * (1 - x) + 1);
    }
}