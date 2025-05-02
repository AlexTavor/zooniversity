import React from 'react';
import './CharacterPortraits.css';
import { GameEvent } from '../../../game/consts/GameEvent';
import { EventBus } from '../../../game/EventBus';

type CharacterPortraitProps = {
  data: {
    entity: number;
    pos: { x: number; y: number };
    character: {
      icon: string;
      type: string;
    };
  };
};

export const CharacterPortrait: React.FC<CharacterPortraitProps> = ({ data }) => {
  return (
    <div
      className="character-portrait"
      style={{
        left: `${data.pos.x}px`,
        top: `${data.pos.y}px`,
        pointerEvents: 'all',
      }}
      onClick={() => {
        EventBus.emit(GameEvent.SelectionChanged, data.entity);
    }}
    >
      <img src={data.character.icon} alt={`${data.character.type} Icon`} />
    </div>
  );
};
