import {TimeComponent} from "../../logic/time/TimeComponent.ts";
import {WeatherComponent} from "../../logic/weather/WeatherComponent.ts";
import {TimeTintPipeline} from "../../../render/pipelines/TimeTintPipeline.ts";
import {TimeConfig} from "../../config/TimeConfig.ts";
import {getColorForMinute, SPRITE_TINT_GRADIENT} from "./getColorForMinute.ts";

/**
 * Updates the TimeTintPipeline with time of day, cloud cover, and optional lighting.
 */
export function updateTimeTintPipeline(
    scene: Phaser.Scene,
    time: TimeComponent,
    weather: WeatherComponent
): void {
    const renderer = scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
    const pipeline = renderer.pipelines.get('TimeTint') as TimeTintPipeline;

    const minute = time.hour * TimeConfig.MinutesPerHour + time.minute;
    const total = TimeConfig.HoursPerDay * TimeConfig.MinutesPerHour;

    const color = getColorForMinute(minute, total, SPRITE_TINT_GRADIENT);
    pipeline.setTintColor(Phaser.Display.Color.ValueToColor(color));
    pipeline.setCloudAlpha(1 - ((weather.cloudCover ?? 0))*.5);
    pipeline.setResolution(scene.scale.width, scene.scale.height);

    // Optional lighting RT (e.g. scene.lightingRT)
    const lightingRT = (scene as any).lightingRT as Phaser.GameObjects.RenderTexture | undefined;
    const glTex = (lightingRT as any)?._renderer?.glTexture;

    pipeline.setLightingTexture(glTex ?? null);
}
