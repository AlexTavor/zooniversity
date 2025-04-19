import {ECS} from "../ECS.ts";
import {TimeComponent} from "./time/TimeComponent.ts";
import {InputComponent} from "./input/InputComponent.ts";
import {WeatherComponent} from "./weather/WeatherComponent.ts";

export function createWorldEntity(ecs: ECS): number {
    const world = ecs.addEntity();
    ecs.addComponent(world, new TimeComponent());
    ecs.addComponent(world, new InputComponent());
    ecs.addComponent(world, new WeatherComponent());

    return world;
}
