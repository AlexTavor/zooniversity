import { EventBus } from "../../EventBus";
import { GameEvent } from "../../consts/GameEvent.ts";
import { GameDisplay } from "../../display/GameDisplay";
import { CameraModule } from "../../display/camera/CameraModule";
import { SelectionHighlightModule } from "../../display/game/tools/selection/SelectionHighlightModule.ts";
import { SelectionPanelModule } from "../../display/game/tools/selection/SelectionPanelModule.ts";
import { CloudsModule } from "../../display/game/sky/CloudsModule";
import { SkyDisplayModule } from "../../display/game/sky/SkyDisplayModule";
import { StarfieldModule } from "../../display/game/sky/StarfieldModule";
import { TinterModule } from "../../display/game/time_tint/TinterModule";
import { TreeSwayModule } from "../../display/game/trees/TreeSwayModule";
import { Game } from "../../scenes/Game";
import { InputSystem } from "../input/InputSystem";
import { CaveExploreStory } from "../story/CaveExploreStory";
import { StoryEventSystem } from "../story/StoryEventSystem";
import { StoryOption } from "../story/StoryEventTypes";
import { TimeSystem } from "../time/TimeSystem";
import { WeatherSystem } from "../weather/WeatherSystem";
import {CaveTreeLUTComponent} from "../lut/CaveTreeLUTComponent.ts";
import {buildCaveTreeLUTFromViews} from "../lut/buildCaveTreeLUTFromViews.ts";
import { GameTools } from "../../display/game/tools/GameTools.ts";
import { WoodDojoSystem } from "../work/WoodDojoSystem.ts";
import { LocomotionSystem } from "../locomotion/LocomotionSystem.ts";
import { TreeHarvestingSystem } from "../work/TreeHarvestingSystem.ts";
import { CaveViewModule } from "../../display/game/buildings/CaveViewModule.ts";
import { BuildingViewModule } from "../../display/game/buildings/BuildingViewModule.ts";
import { TreeViewModule } from "../../display/game/trees/TreeViewModule.ts";
import { TreeCutIconViewModule } from "../../display/game/trees/TreeCutIconViewModule.ts";
import { CharacterViewModule } from "../../display/game/characters/CharacterViewModule.ts";

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
    game.ecs.addSystem(new WeatherSystem());
    game.ecs.addSystem(new WoodDojoSystem());
    game.ecs.addSystem(new LocomotionSystem());
    game.ecs.addSystem(new TreeHarvestingSystem());
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
        new SelectionPanelModule(),
        new CaveViewModule(),
        new BuildingViewModule(),
        new TreeViewModule(),
        new TreeCutIconViewModule(),
        new CharacterViewModule()
    ];
    
    game.gameDisplay.init(game, game.ecs, modules);
}