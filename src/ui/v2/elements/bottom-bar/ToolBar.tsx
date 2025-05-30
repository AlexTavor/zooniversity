import React from 'react';
import styled from '@emotion/styled';
import { EventBus } from '../../../../game/EventBus';
import { GameEvent } from '../../../../game/consts/GameEvent';
import { ToolType } from '../../../../game/display/game/tools/GameTools';
import { useSelectedTool } from '../../hooks/useSelectedTool';
import { ToolButton } from '../buttons/ToolButton';

const BarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px;
`;

export const ToolBar: React.FC = () => {
  const activeTool = useSelectedTool();

  const handleTreeCuttingToolClick = () => {
    EventBus.emit(GameEvent.ToolSelected, ToolType.TreeCutting);
  };

  return (
    <BarWrapper>
      <ToolButton
        toolType={ToolType.TreeCutting}
        isActive={activeTool === ToolType.TreeCutting}
        onClick={handleTreeCuttingToolClick}
        title="Select Trees for Cutting"
      />
    </BarWrapper>
  );
};