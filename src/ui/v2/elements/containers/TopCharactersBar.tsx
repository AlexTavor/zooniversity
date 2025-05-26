// TopCharacterBar.tsx
import React, { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { EventBus } from '../../../../game/EventBus';
import { GameEvent } from '../../../../game/consts/GameEvent';
import { CharacterAction } from '../../../../game/logic/action-intent/actionIntentData';
import { CharacterType } from '../../../../game/logic/characters/Character';
import { CharacterPortraitDisplay } from './CharacterPortraitDisplay';
import { GameUIEvent } from '../../../../game/consts/UIEvent';

interface CharacterUpdateEventPayload {
  id: string | number;
  character: {
    type: CharacterType;
  };
  currentAction: CharacterAction;
}

interface InternalCharacterUIData {
  id: string | number;
  characterType: CharacterType;
  currentAction: CharacterAction;
}


interface TopCharacterBarProps {
  className?: string;
}

const BarWrapper = styled.div`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  gap: 8px;
  padding: 4px;
  border-radius: 8px;
  z-index: 1000;
  pointer-events: all;
`;

export const TopCharacterBar: React.FC<TopCharacterBarProps> = ({
  className,
}) => {
  const [portraitsState, setPortraitsState] = useState<Record<string | number, InternalCharacterUIData>>({});
  const [globallySelectedCharacterId, setGloballySelectedCharacterId] = useState<string | number | null>(null);

  const handleCharacterUpdate = useCallback((data: CharacterUpdateEventPayload) => {
    setPortraitsState(prev => ({
      ...prev,
      [data.id]: {
        id: data.id,
        characterType: data.character.type,
        currentAction: data.currentAction,
      },
    }));
  }, []);

  useEffect(() => {
    const handleSelectionChange = (entityId: string | number | null) => {
      setGloballySelectedCharacterId(entityId === -1 ? null : entityId);
    };

    EventBus.on(GameEvent.CharacterUpdate, handleCharacterUpdate);
    EventBus.on(GameEvent.SelectionChanged, handleSelectionChange);

    return () => {
      EventBus.off(GameEvent.CharacterUpdate, handleCharacterUpdate);
      EventBus.off(GameEvent.SelectionChanged, handleSelectionChange);
    };
  }, [handleCharacterUpdate]);

  const handlePortraitClick = (characterId: string | number) => {
    EventBus.emit(GameUIEvent.PortraitClicked, characterId);
  };

  // Convert the record to an array for rendering
  const charactersToDisplay = Object.values(portraitsState);

  if (charactersToDisplay.length === 0) {
    return <></>;
  }

  return (
    <BarWrapper className={className}>
      {charactersToDisplay.map((charData) => (
        <CharacterPortraitDisplay
          key={charData.id}
          id={charData.id}
          characterType={charData.characterType}
          currentAction={charData.currentAction}
          onClick={() => handlePortraitClick(charData.id)}
          isSelected={globallySelectedCharacterId === charData.id}
        />
      ))}
    </BarWrapper>
  );
};
