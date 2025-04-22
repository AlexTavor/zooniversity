import { EventBus } from "../../EventBus";
import { GameEvent } from "../../consts/GameEvents";
import { GameDisplay } from "../../display/GameDisplay";
import { CameraModule } from "../../display/camera/CameraModule";
import { createCaveViewTracker } from "../../display/game/createCaveViewTracker";
import { createTreeViewTracker } from "../../display/game/createTreeViewTracker";
import { SelectionHighlightModule } from "../../display/game/selection/SelectionHighlightModule";
import { SelectionModule } from "../../display/game/selection/SelectionModule";
import { SelectionPanelModule } from "../../display/game/selection/SelectionPanelModule";
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
    initInput(game);
    initStory(game);
    initLut(game);
}

const initLut = (game:Game) => {
    const handleViewsInitialized = ()=>{
        const viewDefs = Array.from(game.gameDisplay.viewsByEntity.values()).map(v=>v.viewDefinition);
        const lut = new CaveTreeLUTComponent(buildCaveTreeLUTFromViews(viewDefs));
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
        new SelectionModule(),
        new SelectionPanelModule()
    ];
    
    game.gameDisplay.init(game, game.ecs, modules,
    [
        (display:GameDisplay)=>createTreeViewTracker(display),
        (display:GameDisplay)=>createCaveViewTracker(display)
    ]);
}