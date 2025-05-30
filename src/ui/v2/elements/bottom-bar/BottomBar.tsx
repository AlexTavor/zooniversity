import React from 'react';
import styled from '@emotion/styled';
import { SelectionPanel } from '../panel/SelectionPanel';
import { ToolBar } from './ToolBar';

const HUDWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  /* width: 100%; // Removed to allow intrinsic sizing from children */
  display: inline-flex; /* So the wrapper itself shrinks to content */
  flex-direction: row;
  align-items: flex-end;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`;

const SelectionPanelWrapper = styled.div`
  /* flex-grow: 1; // Removed */
  /* min-width: 0; // Removed or adjust if specific min needed */
  width: auto; /* Allow content to dictate width */
`;

const ToolBarWrapper = styled.div`
  flex-shrink: 0;
`;


export const BottomBar: React.FC = () => {
  return (
    <HUDWrapper>
      <SelectionPanelWrapper>
        <SelectionPanel />
      </SelectionPanelWrapper>
      <ToolBarWrapper>
        <ToolBar />
      </ToolBarWrapper>
    </HUDWrapper>
  );
};