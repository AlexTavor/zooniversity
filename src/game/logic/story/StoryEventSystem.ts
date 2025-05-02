import { System, Entity } from "../../ECS";
import { EventBus } from "../../EventBus";
import { GameEvent } from "../../consts/GameEvent";
import { StoryEventStateComponent } from "./StoryEventComponent";
import { StoryEventDefinition } from "./StoryEventTypes";

export class StoryEventSystem extends System {
    public update(entities: Set<number>, delta: number): void {
        
    }
    
    componentsRequired = new Set<Function>([StoryEventStateComponent]);

    private activeEvent: StoryEventDefinition | null = null;
    private allEvents: Record<string, StoryEventDefinition>;

    constructor(allEvents: Record<string, StoryEventDefinition>) {
        super();
        this.allEvents = allEvents;
    }

    public start(eventId: string) {
        const event = this.allEvents[eventId];
        if (!event) return;
        this.activeEvent = event;

        const entity = this.ecs.addEntity();
        this.ecs.addComponent(entity, new StoryEventStateComponent(eventId, event.startPageId));

        EventBus.emit(GameEvent.StoryEventStarted, event.pages[event.startPageId]);
    }

    public advance(entity: Entity, nextPageId?: string) {
        const state = this.ecs.getComponent(entity, StoryEventStateComponent);
        if (!state || !this.activeEvent) return;

        if (!nextPageId) {
            this.ecs.removeEntity(entity);
            EventBus.emit(GameEvent.StoryEventEnded);
            return;
        }

        state.currentPageId = nextPageId;
        EventBus.emit(GameEvent.StoryEventPageChanged, this.activeEvent.pages[nextPageId]);
    }
}
