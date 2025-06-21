// CharacterPortraitDisplay.tsx
import React from 'react';
import styled from '@emotion/styled';
import { ActionIcon } from '../icons/ActionIcon'; 
import { CharacterType } from '../../../../game/logic/characters/Character';
import { CharacterAction } from '../../../../game/logic/intent/intent-to-action/actionIntentData';

const characterPortraitIconMap: Partial<Record<CharacterType, string>> = {
  [CharacterType.PROFESSOR]: 'assets/characters/booker/booker_icon.png'
};

export interface CharacterUIData {
  id: string | number; // Entity ID
  characterType: CharacterType;
  currentAction: CharacterAction;
  // actionProgress?: number; // For potential future use with a fill on the action icon itself
  // vitalityPercent?: number; // For the main portrait fill, deferred for now
  onClick?: (id: string | number) => void;
  isSelected?: boolean; // To indicate if this portrait matches a globally selected character
}

interface CharacterPortraitDisplayProps extends CharacterUIData {
  size?: string; // Overall size of the portrait display
  actionIconSize?: string; // Size of the action icon overlay
  backgroundColor?: string;
}

const PortraitWrapper = styled.div<{
  size: string;
  isSelected: boolean;
  backgroundColor: string;
}>`
  width: ${props => props.size};
  height: ${props => props.size};
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  background-color: ${props=>props.backgroundColor};
  border: 2px solid ${props => (props.isSelected ? '#FFD700' : '#555')}; // Highlight if selected
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: border-color 0.2s ease-in-out, transform 0.1s ease-out;

  &:hover {
    border-color: ${props => (props.isSelected ? '#FFEA00' : '#777')};
    transform: scale(1.05);
  }
`;

const PortraitImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
`;

const ActionIconOverlay = styled.div<{ iconSize: string }>`
  position: absolute;
  bottom: -10px; /* Adjust for slight overlap or precise cornering */
  left: -10px;   /* Adjust for slight overlap or precise cornering */
  width: ${props => props.iconSize};
  height: ${props => props.iconSize};
  /* Add a small background or border to the overlay itself if needed for contrast */
  /* background-color: rgba(0,0,0,0.3); */
  /* border-radius: 50%; */
`;

export const CharacterPortraitDisplay: React.FC<CharacterPortraitDisplayProps> = ({
  id,
  characterType,
  currentAction,
  onClick,
  isSelected = false,
  size = '48px', // Default size for the portrait
  actionIconSize, // Default size for the action icon relative to portrait size
  backgroundColor = "white"
}) => {
  const portraitSrc = characterPortraitIconMap[characterType] || 'assets/icons/unknown_character.png'; // Fallback
  const finalActionIconSize = actionIconSize || `calc(${size} * 0.55)`; // Action icon is ~55% of portrait size

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <PortraitWrapper
      backgroundColor={backgroundColor}
      size={size}
      isSelected={isSelected}
      onClick={handleClick}
      title={`${characterType}`}
    >
      <PortraitImage src={portraitSrc} alt={`${characterType}`} />
        {
        currentAction ? <ActionIconOverlay iconSize={finalActionIconSize}>
          <ActionIcon
            actionType={currentAction}
            size="100%"
            backgroundColor='#000000'
          />
        </ActionIconOverlay> : null
        }
    </PortraitWrapper>
  );
};