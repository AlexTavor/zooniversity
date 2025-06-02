import React, { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';

import { EventBus } from '../../../../game/EventBus';
import { PanelType } from '../../../../game/display/setup/ViewDefinition';
import { PinButton, PinIconType, ChevronDirection } from '../buttons/PinButton';
import { SelectionTabBar } from './SelectionTabBar';
import { TABS_CONFIG } from './TabTypes'; // Ensure this path is correct
import { GameUIEvent } from '../../../../game/consts/UIEvent'; // Using your GameUIEvent
import { CharacterThoughtsContentCollapsed } from './character/CharacterThoughtsContentCollapsed';
import { CharacterThoughtsContent } from './character/CharacterThoughtsContent';
import { CharacterInfoContent } from './character/CharacterInfoContent';
import { CharacterInfoContentCollapsed } from './character/CharcterInfoContentCollapsed';
import { TreePanelContent } from './tree/TreePanelContent';

export interface SelectedEntityPayload {
  id: string | number;
  title: string;
  panelType: PanelType;
  panelTypeData: any;
  findAction?:()=>void;
}

export interface EntityContentViewProps<TData = any> {
  data: TData;
  isContentAreaCollapsed: boolean;
}
export type EntityContentView<TData = any> = React.FC<EntityContentViewProps<TData>>;

type ContentByTab = Partial<Record<string, EntityContentView>>;

const charContentRegistry: ContentByTab = {
  ['thoughts']: ({ data, isContentAreaCollapsed }) => isContentAreaCollapsed ? <CharacterThoughtsContentCollapsed data={data}/> : <CharacterThoughtsContent  data={data}/>,
  ['info']: ({ data, isContentAreaCollapsed }) => isContentAreaCollapsed ? <CharacterInfoContentCollapsed data={data}/> : <CharacterInfoContent  data={data}/>,
};

const treeContentRegistry: ContentByTab = {
  "info": ({ data, isContentAreaCollapsed }) => {
    return <TreePanelContent data={data} />;
  }
};

const contentViewRegistry: Partial<Record<PanelType, ContentByTab>> = {
    [PanelType.CHARACTER]: charContentRegistry,
    [PanelType.TREE]: treeContentRegistry,
};

const PanelOuterWrapper = styled.div`
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  width: 400px;
  z-index: 800;
  background-color: transparent; /* Outer wrapper is transparent */
`;

const PlaceholderText = styled.div<{ height: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${props => props.height};
  font-size: 0.8rem;
  color: #777;
  font-style: italic;
  background-color: rgba(30, 32, 35, 0.98); /* Background for placeholder only */
  flex-shrink: 0;
`;

const MainContentWrapper = styled.div`
  background-color: rgba(30, 32, 35, 0.98); /* Main panel background, below tabs if tabs are styled separately */
  color: #dde;
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Allows it to expand if PanelOuterWrapper uses flex for height */
  min-height: 0; /* For flex children */
  padding-left: 8px;
`;


const ThinControlBar = styled.div`
  font-size: 0.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 24px; /* Slightly smaller */
  flex-shrink: 0;
  border-bottom: 1px solid #2a2c2e;
`;

const TabContentArea = styled.div`
  background-color: transparent;
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0; /* Important for flex context */
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.15); border-radius: 3px; }
  &::-webkit-scrollbar-track { background-color: transparent; }
`;

const MINIMAL_PANEL_HEIGHT_NO_SELECTION = '36px';
const TAB_BAR_HEIGHT = '30px';

export const SelectionPanel: React.FC = () => {
  const [currentEntity, setCurrentEntity] = useState<SelectedEntityPayload | null>(null);
  const [isContentAreaCollapsed, setIsContentAreaCollapsed] = useState<boolean>(true);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  useEffect(() => {
    const handleSelectedEntityUpdate = (data: SelectedEntityPayload | null) => {
      setCurrentEntity(data);

      const tabs = TABS_CONFIG[data?.panelType as PanelType];
      if (!tabs) {
        setActiveTabId(null);
        return;
      }
      
      const currentIndex = tabs.findIndex((value)=>value.id == activeTabId);
      
      currentIndex == -1 && setActiveTabId(tabs[0].id);
    };
    EventBus.on(GameUIEvent.ShowPanelCalled, handleSelectedEntityUpdate);
    return () => {
      EventBus.off(GameUIEvent.ShowPanelCalled, handleSelectedEntityUpdate);
    };
  }, [activeTabId]);

  const toggleContentCollapse = useCallback(() => {
    setIsContentAreaCollapsed(prev => !prev);
  }, []);

  const handleTabSelect = useCallback((tabId: string) => {
    setActiveTabId(tabId);
  }, []);

  const currentPanelType = currentEntity?.panelType as PanelType | null;
  const ContentComponentToRender = currentPanelType ? contentViewRegistry[currentPanelType]?.[activeTabId ?? ''] : null;
  const hasTabs = !!(currentPanelType && TABS_CONFIG[currentPanelType] && TABS_CONFIG[currentPanelType]!.length > 0);

  if (!currentEntity) {
    return (
      <PanelOuterWrapper>
        <PlaceholderText height={MINIMAL_PANEL_HEIGHT_NO_SELECTION}>
          Nothing Selected
        </PlaceholderText>
      </PanelOuterWrapper>
    );
  }

  const chevronDirection: ChevronDirection = !isContentAreaCollapsed ? 'up' : 'down';

  return (
    <PanelOuterWrapper>
      {hasTabs && currentPanelType && (
        <SelectionTabBar
          panelType={currentPanelType}
          activeTabId={activeTabId}
          onTabSelect={handleTabSelect}
          tabButtonHeight={TAB_BAR_HEIGHT}
        />
      )}
      <MainContentWrapper>
        <ThinControlBar>
          {currentEntity.title}
          <div>
          {
            currentEntity?.findAction ? 
            <PinButton
              iconType={PinIconType.LOOKING_GLASS}
              title="Inspect Selected"
              onClick={currentEntity.findAction}
              size="16px"
            /> : null
          }
          {hasTabs && (
            <PinButton
              iconType={PinIconType.CHEVRON}
              direction={chevronDirection}
              title={isContentAreaCollapsed ? "Open Details" : "Collapse Details"}
              onClick={toggleContentCollapse}
              size="16px"
            />
          )}
          </div>
        </ThinControlBar>
        {ContentComponentToRender && activeTabId && (
          <TabContentArea>
            <ContentComponentToRender
              data={currentEntity.panelTypeData}
              isContentAreaCollapsed={isContentAreaCollapsed}
            />
          </TabContentArea>
        )}
      </MainContentWrapper>
    </PanelOuterWrapper>
  );
};