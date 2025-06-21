import React from 'react';
import styled from '@emotion/styled';
import { StatusLine, UIStatusEffectData } from './StatusLine';

interface StatusEffectsDisplayProps {
  effects: UIStatusEffectData[];
  className?: string;
  maxHeight?: string;
  iconSize?: string;
  positiveTextColor?: string;
  negativeTextColor?: string;
  buffIconFillColor?: string;
  debuffIconFillColor?: string;
  iconBackgroundColor?: string;
  iconBorderColor?: string;
  emptyStateText?: string;
  isCollapsed?: boolean;
}

const DisplayWrapper = styled.div<{ maxHeight?: string }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: ${props => (props.maxHeight ? 'auto' : 'visible')};
  max-height: ${props => props.maxHeight || 'none'};

  /* Styling for scrollbar if needed */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const EmptyStateMessage = styled.div`
  padding: 8px;
  font-size: 0.85rem;
  color: #888; /* Or your theme's muted text color */
  text-align: center;
  font-style: italic;
`;

export const StatusEffectsDisplay: React.FC<StatusEffectsDisplayProps> = ({
  effects,
  className,
  maxHeight,
  iconSize, // Will be passed to StatusLine, which has its own default
  positiveTextColor,
  negativeTextColor,
  buffIconFillColor,
  debuffIconFillColor,
  iconBackgroundColor,
  iconBorderColor,
  isCollapsed,
  emptyStateText = "No active effects.",
}) => {
  if (!effects || effects.length === 0) {
    return (
      <DisplayWrapper className={className} maxHeight={maxHeight}>
        <EmptyStateMessage>{emptyStateText}</EmptyStateMessage>
      </DisplayWrapper>
    );
  }

  return (
    <DisplayWrapper className={className} maxHeight={maxHeight}>
      {effects.map((effectData) => (
        <StatusLine
          key={effectData.key}
          effectData={effectData}
          iconSize={iconSize}
          positiveTextColor={positiveTextColor}
          negativeTextColor={negativeTextColor}
          buffIconFillColor={buffIconFillColor}
          debuffIconFillColor={debuffIconFillColor}
          iconBackgroundColor={iconBackgroundColor}
          iconBorderColor={iconBorderColor}
          isCollapsed={isCollapsed}
        />
      ))}
    </DisplayWrapper>
  );
};