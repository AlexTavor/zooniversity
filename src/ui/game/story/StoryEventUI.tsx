import React, { useEffect, useState } from "react";
import { StoryEventPage } from "../../../game/logic/story/StoryEventTypes";
import { GameEvent } from "../../../game/consts/GameEvent";
import { EventBus } from "../../../game/EventBus";
import "./StoryEventUI.css";

export const StoryEventUI: React.FC = () => {
    const [page, setPage] = useState<StoryEventPage | null>(null);

    useEffect(() => {
        EventBus.on(GameEvent.StoryEventStarted, setPage);
        EventBus.on(GameEvent.StoryEventPageChanged, setPage);
        EventBus.on(GameEvent.StoryEventEnded, () => setPage(null));

        return () => {
            EventBus.off(GameEvent.StoryEventStarted, setPage);
            EventBus.off(GameEvent.StoryEventPageChanged, setPage);
            EventBus.off(GameEvent.StoryEventEnded, () => setPage(null));
        };
    }, []);

    if (!page) return null;

    return (
        <div
            className="story-event-ui"
            style={{ backgroundImage: `url(${page.imagePath})` }}
        >
            <div className="story-text">{page.text}</div>
            <div className="story-options">
                {page.options.map((opt, idx) => (
                    <button
                        key={idx}
                        onClick={() =>
                            EventBus.emit(GameEvent.StoryEventOptionChosen, opt)
                        }
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
