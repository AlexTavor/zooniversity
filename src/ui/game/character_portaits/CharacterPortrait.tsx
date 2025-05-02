import React from 'react';
import './CharacterPortraits.css';

type CharacterPortraitProps = {
  data: {
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
      }}
    >
      <img src={data.character.icon} alt={`${data.character.type} Icon`} />
    </div>
  );
};
