import { GameDisplayContext } from "../GameDisplay.ts";
import { DisplayModule } from "../setup/DisplayModule.ts";
import { TimeComponent } from "../../logic/time/TimeComponent.ts";
import { WeatherComponent } from "../../logic/weather/WeatherComponent.ts";
import { updateTimeTintPipeline } from "./updateTimeTintPineline.ts";
import { getWorldEntity } from "../../logic/serialization/getWorldEntity.ts";

export class TinterModule extends DisplayModule<GameDisplayContext> {
    private worldEntity!: number;
    private context!: GameDisplayContext;

    init(context: GameDisplayContext): void {
        this.context = context;
        const { ecs } = context;

        this.worldEntity = getWorldEntity(ecs);
    }

    update(_: number): void {
        const { ecs, scene } = this.context;
        const time = ecs.getComponent(this.worldEntity, TimeComponent);
        const weather = ecs.getComponent(this.worldEntity, WeatherComponent);
        updateTimeTintPipeline(scene, time, weather);
    }

    destroy(): void {}
}
