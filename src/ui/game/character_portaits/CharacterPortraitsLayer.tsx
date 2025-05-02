import React, { useEffect, useState, useRef } from 'react';
import './CharacterPortraits.css';
import { CharacterPortrait } from './CharacterPortrait';
import { EventBus } from '../../../game/EventBus';
import { GameEvent } from '../../../game/consts/GameEvent';

type CharacterUpdateData = {
  id: number;
  pos: { x: number; y: number };
  character: {
    icon: string;
    type: string;
  };
};

export const CharacterPortraitsLayer: React.FC = () => {
  const [portraits, setPortraits] = useState<Record<number, CharacterUpdateData>>({});
  const seenThisFrameRef = useRef<Record<number, number>>({});

  useEffect(() => {
    const seenThisFrame = seenThisFrameRef.current;

    const handleUpdate = (data: CharacterUpdateData) => {
      const count = seenThisFrame[data.id] || 0;
      const isNewTick = count >= 1;

      if (isNewTick) {
        // Reset seenThisFrame to only include this entity
        seenThisFrameRef.current = { [data.id]: 1 };

        setPortraits({ [data.id]: data });
      } else {
        seenThisFrame[data.id] = count + 1;

        setPortraits(prev => ({
          ...prev,
          [data.id]: data,
        }));
      }
    };

    EventBus.on(GameEvent.CharacterUpdate, handleUpdate);
    return () => {
      EventBus.off(GameEvent.CharacterUpdate, handleUpdate);
    };
  }, []);

  return (
    <>
      {Object.entries(portraits).map(([id, data]) => (
        <CharacterPortrait key={id} data={{...data, entity:+id}} />
      ))}
    </>
  );
};
