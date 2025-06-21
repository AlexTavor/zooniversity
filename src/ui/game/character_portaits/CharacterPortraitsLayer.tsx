import React, { useEffect, useRef, useState } from "react";
import "./CharacterPortraits.css";
import { CharacterPortrait } from "./CharacterPortrait";
import { EventBus } from "../../../game/EventBus";
import { GameEvent } from "../../../game/consts/GameEvent";

type CharacterUpdateData = {
    id: number;
    pos: { x: number; y: number };
    character: {
        icon: string;
        type: string;
    };
};

export const CharacterPortraitsLayer: React.FC = () => {
    const [portraits, setPortraits] = useState<
        Record<number, CharacterUpdateData>
    >({});
    const seenThisFrameRef = useRef<Set<number>>(new Set());
    const tickRef = useRef(0);

    // Reset seenThisFrame every animation frame
    useEffect(() => {
        let raf: number;
        const loop = () => {
            seenThisFrameRef.current.clear();
            tickRef.current++;
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, []);

    useEffect(() => {
        const handleUpdate = (data: CharacterUpdateData) => {
            seenThisFrameRef.current.add(data.id);

            setPortraits((prev) => ({
                ...prev,
                [data.id]: data,
            }));
        };

        EventBus.on(GameEvent.CharacterUpdate, handleUpdate);
        return () => {
            EventBus.off(GameEvent.CharacterUpdate, handleUpdate);
        };
    }, []);

    return (
        <>
            {Object.entries(portraits).map(([id, data]) => (
                <CharacterPortrait key={id} data={{ ...data, entity: +id }} />
            ))}
        </>
    );
};
