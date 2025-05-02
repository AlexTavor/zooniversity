import {ECS} from "../../ECS.ts";
import {TimeComponent} from "../time/TimeComponent.ts";
import {InputComponent} from "../input/InputComponent.ts";
import {WeatherComponent} from "../weather/WeatherComponent.ts";
import { WoodDojo } from "../components/WoodDojo.ts";
import { Transform } from "../components/Transform.ts";
import { Character, CharacterType } from "../components/Character.ts";

export function createWorldEntity(ecs: ECS): number {
    const world = ecs.addEntity();
    ecs.addComponent(world, new TimeComponent());
    ecs.addComponent(world, new InputComponent());
    ecs.addComponent(world, new WeatherComponent());

    return world;
}

export function createProfessorBooker(ecs: ECS): number {
    // Get the wood dojo transform, get position from it for the booker
    const woodDojo = ecs.getEntitiesWithComponent(WoodDojo)[0];
    const woodDojoTransform = ecs.getComponent(woodDojo, Transform);

    // and add the booker entity to the ECS
    const booker = ecs.addEntity();
    ecs.addComponent(booker, new Transform(woodDojoTransform.x - 200, woodDojoTransform.y, 0));
    ecs.addComponent(booker, new Character({
        name: "Professor Booker",
        description: "The professor of the academy. He is a master of the wood element.",
        type: CharacterType.PROFESSOR,
    }));

    return booker;
}