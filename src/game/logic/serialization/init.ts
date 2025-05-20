import { EventBus } from "../../EventBus.ts";
import { GameEvent } from "../../consts/GameEvent.ts";
import { GameDisplay } from "../../display/GameDisplay.ts";
import { CameraModule } from "../../display/camera/CameraModule.ts";
import { SelectionHighlightModule } from "../../display/game/tools/selection/SelectionHighlightModule.ts";
import { DataPanelModule } from "../../display/game/data_panel/DataPanelModule.ts";
import { CloudsModule } from "../../display/game/sky/CloudsModule.ts";
import { SkyDisplayModule } from "../../display/game/sky/SkyDisplayModule.ts";
import { StarfieldModule } from "../../display/game/sky/StarfieldModule.ts";
import { TinterModule } from "../../display/game/time_tint/TinterModule.ts";
import { TreeSwayModule } from "../../display/game/trees/TreeSwayModule.ts";
import { Game } from "../../scenes/Game.ts";
import { InputSystem } from "../input/InputSystem.ts";
import { CaveExploreStory } from "../story/CaveExploreStory.ts";
import { StoryEventSystem } from "../story/StoryEventSystem.ts";
import { StoryOption } from "../story/StoryEventTypes.ts";
import { TimeSystem } from "../time/TimeSystem.ts";
import { WeatherSystem } from "../weather/WeatherSystem.ts";
import {CaveTreeLUTComponent} from "../lut/CaveTreeLUTComponent.ts";
import {buildCaveTreeLUTFromViews} from "../lut/buildCaveTreeLUTFromViews.ts";
import { GameTools } from "../../display/game/tools/GameTools.ts";
import { WoodDojoSystem } from "../buildings/wood_dojo/WoodDojoSystem.ts";
import { LocomotionSystem } from "../locomotion/LocomotionSystem.ts";
import { TreeHarvestingSystem } from "../trees/TreeHarvestingSystem.ts";
import { CaveViewModule } from "../../display/game/buildings/CaveViewModule.ts";
import { BuildingViewModule } from "../../display/game/buildings/BuildingViewModule.ts";
import { TreeViewModule } from "../../display/game/trees/TreeViewModule.ts";
import { TreeCutIconViewModule } from "../../display/game/trees/TreeCutIconViewModule.ts";
import { CharacterViewModule } from "../../display/game/characters/CharacterViewModule.ts";
import { ResourceSystem } from "../resources/ResourceSystem.ts";
import { ScheduleSystem } from "../scheduling/ScheduleSystem.ts";
import { ECS, Entity } from "../../ECS.ts";
import { Character, CharacterType } from "../characters/Character.ts";
import { Transform } from "../../components/Transform.ts";
import { WoodDojo } from "../buildings/wood_dojo/WoodDojo.ts";
import { InputComponent } from "../input/InputComponent.ts";
import { LocomotionComponent } from "../locomotion/LocomotionComponent.ts";
import { ResourceComponent } from "../resources/ResourceComponent.ts";
import { createStandardSchedule } from "../scheduling/ScheduleComponent.ts";
import { TimeComponent } from "../time/TimeComponent.ts";
import { WeatherComponent } from "../weather/WeatherComponent.ts";
import { HarvesterComponent } from "../trees/HarvesterComponent.ts";
import { loadPanelRegistry } from "../../display/game/data_panel/PanelRegistry.ts";
import { DormitorySystem } from "../buildings/dormitory/DormitorySystem.ts";
import { DormitoryComponent } from "../buildings/dormitory/DormitoryComponent.ts";
import { ActionIntentComponent } from "../action-intent/ActionIntentComponent.ts";
import { ActionIntentSystem } from "../action-intent/ActionIntentSystem.ts";
import { HomeComponent } from "../buildings/dormitory/HomeComponent.ts";
import { RelaxBehaviorSystem } from "../action-intent/RelaxBehaviorSystem.ts";
import { ActiveBuffsComponent } from "../buffs/ActiveBuffsComponent.ts";
import { BuffManagementSystem } from "../buffs/BuffManagementSystem.ts";
import { WorkerComponent } from "../work/WorkerComponent.ts";
import { BlockedIntentSystem } from "../action-intent/BlockedIntentSystem.ts";
import { SleepEffectsSystem } from "../buffs/SleepEffectsSystem.ts";

export const init = (game:Game) => {
    initData(game);
    initDisplay(game);
    initSystems(game);
    EventBus.emit(GameEvent.ViewsInitialized);
}

export const initStory = (game:Game) => {
    const story = new StoryEventSystem({
        "intro": CaveExploreStory
    });

    game.ecs.addSystem(story);

    const handleStoryEvent = (opt: StoryOption) => {
        if (opt.effect) opt.effect(game.ecs);
        if (opt.close) {
            EventBus.emit(GameEvent.StoryEventEnded);
        } else {
            story.advance(opt.entity!, opt.nextPageId);
        }
    };

    EventBus.on(GameEvent.StoryEventOptionChosen, handleStoryEvent);

    game.destroyQueue.push(() => {
        EventBus.off(GameEvent.StoryEventOptionChosen, handleStoryEvent);
    });
}

export const initInput = (game:Game) => {
    const input = new InputSystem();
    game.ecs.addSystem(input);
    const destroyInput = input.initialize();
    game.destroyQueue.push(destroyInput);
}

export const initSystems = (game:Game)=>{
    game.ecs.addSystem(new TimeSystem());
    game.ecs.addSystem(new ScheduleSystem());
    game.ecs.addSystem(new WeatherSystem());
    game.ecs.addSystem(new LocomotionSystem());
    game.ecs.addSystem(new ActionIntentSystem());
    game.ecs.addSystem(new SleepEffectsSystem());
    game.ecs.addSystem(new BlockedIntentSystem());
    game.ecs.addSystem(new TreeHarvestingSystem())
    game.ecs.addSystem(new RelaxBehaviorSystem());
    game.ecs.addSystem(new BuffManagementSystem());
    game.ecs.addSystem(new ResourceSystem());
    game.ecs.addSystem(new WoodDojoSystem());
    game.ecs.addSystem(new DormitorySystem());

    initInput(game);
    initStory(game);
    initLut(game);
}

const initLut = (game:Game) => {
    const handleViewsInitialized = ()=>{
        const lut = new CaveTreeLUTComponent(buildCaveTreeLUTFromViews(game.gameDisplay.viewsByEntity));
        game.ecs.addComponent(game.ecs.addEntity(), lut);
    }
    
    EventBus.on(GameEvent.ViewsInitialized, handleViewsInitialized);

    game.destroyQueue.push(() => {
        EventBus.off(GameEvent.ViewsInitialized, handleViewsInitialized);
    });
}

export const initData = (game:Game) => {
    loadPanelRegistry(game);
}

export const initDisplay = (game:Game)=>{
    game.gameDisplay = new GameDisplay();
    
    const modules = [
        new CameraModule(),
        new SkyDisplayModule(),
        new StarfieldModule(),
        new CloudsModule(),
        new TinterModule(),
        new TreeSwayModule(),
        new SelectionHighlightModule(),
        new GameTools(),
        new DataPanelModule(),
        new CaveViewModule(),
        new BuildingViewModule(),
        new TreeViewModule(),
        new TreeCutIconViewModule(),
        new CharacterViewModule(),
    ];
    
    game.gameDisplay.init(game, game.ecs, modules);
}

export function initWorld(ecs: ECS): number {
    const world = ecs.addEntity();
    ecs.addComponent(world, new TimeComponent());
    ecs.addComponent(world, new InputComponent());
    ecs.addComponent(world, new WeatherComponent());
    ecs.addComponent(world, new ResourceComponent());
    
    return world;
}

export function createProfessorBooker(ecs: ECS): number {
    // Get the wood dojo transform, get position from it for booker
    const woodDojoEntity = ecs.getEntitiesWithComponent(WoodDojo)[0];
    const woodDojoTransform = ecs.getComponent(woodDojoEntity, Transform);
    const woodDojo = ecs.getComponent(woodDojoEntity, WoodDojo);

    const dormEntity = ecs.getEntitiesWithComponent(DormitoryComponent)[0];
    const dorm = ecs.getComponent(dormEntity, DormitoryComponent);

    // and add booker entity to the ECS
    const booker = addBooker(ecs, woodDojoTransform, woodDojo, dorm, dormEntity);
    
    return booker;
}

function addBooker(ecs: ECS, woodDojoTransform: Transform, woodDojo: WoodDojo, dorm:DormitoryComponent, homeEntity:Entity) {
    const booker = ecs.addEntity();
    
    ecs.addComponent(booker, new Transform(woodDojoTransform.x - 200, woodDojoTransform.y));
    ecs.addComponent(booker, new Character({
        name: "Professor Booker",
        description: "The professor of the academy. He is a master of the wood element.",
        type: CharacterType.PROFESSOR,
    }));
    ecs.addComponent(booker, new HomeComponent(homeEntity));
    ecs.addComponent(booker, new ActionIntentComponent());
    ecs.addComponent(booker, new LocomotionComponent());
    ecs.addComponent(booker, new HarvesterComponent());
    ecs.addComponent(booker, new ActiveBuffsComponent());
    ecs.addComponent(booker, new WorkerComponent());
    ecs.addComponent(booker, createStandardSchedule());

    woodDojo.assignedCharacters.push(booker);
    dorm.assignedCharacters.push(booker);


    return booker;
}
