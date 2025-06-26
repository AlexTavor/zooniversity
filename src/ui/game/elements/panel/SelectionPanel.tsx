// src/ui/panel/SelectionPanel.tsx
import React, { useState, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import { PanelType } from "../../../../game/display/setup/ViewDefinition";
import { usePanelData } from "../../hooks/usePanelData";
import { useSelection } from "../../hooks/useSelection";
import { ChevronDirection, PinButton, PinIconType } from "../buttons/PinButton";
import { SelectionTabBar } from "./SelectionTabBar";
import { TABS_CONFIG } from "./TabTypes";
import { CharacterInfoContent } from "./character/CharacterInfoContent";
import { CharacterThoughtsContent } from "./character/CharacterThoughtsContent";
import { CharacterThoughtsContentCollapsed } from "./character/CharacterThoughtsContentCollapsed";
import { CharacterInfoContentCollapsed } from "./character/CharcterInfoContentCollapsed";
import { TreePanelContent } from "./tree/TreePanelContent";
import { TreePanelContentCollapsed } from "./tree/TreePanelContentCollapsed";

export interface EntityContentViewProps<TData = any> {
    data: TData;
    isContentAreaCollapsed: boolean;
}

export type EntityContentView<TData = any> = React.FC<
    EntityContentViewProps<TData>
>;

type ContentByTab = Partial<Record<string, EntityContentView>>;
const charContentRegistry: ContentByTab = {
    // eslint-disable-next-line react/prop-types
    ["thoughts"]: ({ data, isContentAreaCollapsed }) =>
        isContentAreaCollapsed ? (
            <CharacterThoughtsContentCollapsed data={data} />
        ) : (
            <CharacterThoughtsContent data={data} />
        ),
    // eslint-disable-next-line react/prop-types
    ["info"]: ({ data, isContentAreaCollapsed }) =>
        isContentAreaCollapsed ? (
            <CharacterInfoContentCollapsed data={data} />
        ) : (
            <CharacterInfoContent data={data} />
        ),
};
const treeContentRegistry: ContentByTab = {
    info: ({ data, isContentAreaCollapsed }) => {
        return isContentAreaCollapsed ? (
            <TreePanelContentCollapsed data={data} />
        ) : (
            <TreePanelContent data={data} />
        );
    },
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
    height: ${(props) => props.height};
    font-size: 0.8rem;
    color: #777;
    font-style: italic;
    background-color: rgba(30, 32, 35, 0.98);
    flex-shrink: 0;
`;
const MainContentWrapper = styled.div`
    background-color: rgba(30, 32, 35, 0.98);
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
    padding-right: 8px; /* Padding for buttons */
    border-bottom: 1px solid #2a2c2e;
`;
const TabContentArea = styled.div`
    background-color: transparent;
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0; /* Important for flex context */
    &::-webkit-scrollbar {
        width: 5px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.15);
        border-radius: 3px;
    }
    &::-webkit-scrollbar-track {
        background-color: transparent;
    }
`;

const MINIMAL_PANEL_HEIGHT_NO_SELECTION = "36px";
const TAB_BAR_HEIGHT = "30px";

export const SelectionPanel: React.FC = () => {
    const selectedEntityId = useSelection();
    const panelData = usePanelData(selectedEntityId);

    const [isContentAreaCollapsed, setIsContentAreaCollapsed] =
        useState<boolean>(true);
    const [activeTabId, setActiveTabId] = useState<string | null>(null);

    // Effect to reset or define the active tab when the panel data changes
    useEffect(() => {
        if (!panelData) {
            setActiveTabId(null);
            return;
        }

        const tabs = TABS_CONFIG[panelData.panelType as PanelType];
        if (!tabs || tabs.length === 0) {
            setActiveTabId(null);
            return;
        }

        // If the current tab isn't valid for the new panel type, reset to the first tab
        const currentTabIsValid = tabs.some((tab) => tab.id === activeTabId);
        if (!currentTabIsValid) {
            setActiveTabId(tabs[0].id);
        }
    }, [panelData, activeTabId]);

    const toggleContentCollapse = useCallback(() => {
        setIsContentAreaCollapsed((prev) => !prev);
    }, []);

    const handleTabSelect = useCallback((tabId: string) => {
        setActiveTabId(tabId);
    }, []);

    const currentPanelType = panelData?.panelType as PanelType | null;
    const ContentComponentToRender = currentPanelType
        ? contentViewRegistry[currentPanelType]?.[activeTabId ?? ""]
        : null;

    const hasTabs = !!(
        currentPanelType &&
        TABS_CONFIG[currentPanelType] &&
        TABS_CONFIG[currentPanelType]!.length > 0
    );

    if (!panelData) {
        return (
            <PanelOuterWrapper>
                <PlaceholderText height={MINIMAL_PANEL_HEIGHT_NO_SELECTION}>
                    Nothing Selected
                </PlaceholderText>
            </PanelOuterWrapper>
        );
    }

    const chevronDirection: ChevronDirection = !isContentAreaCollapsed
        ? "up"
        : "down";

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
                    {panelData.title}
                    <div>
                        {panelData?.findAction ? (
                            <PinButton
                                iconType={PinIconType.LOOKING_GLASS}
                                title="Inspect Selected"
                                onClick={panelData.findAction}
                                size="16px"
                            />
                        ) : null}
                        {hasTabs && (
                            <PinButton
                                iconType={PinIconType.CHEVRON}
                                direction={chevronDirection}
                                title={
                                    isContentAreaCollapsed
                                        ? "Open Details"
                                        : "Collapse Details"
                                }
                                onClick={toggleContentCollapse}
                                size="16px"
                            />
                        )}
                    </div>
                </ThinControlBar>
                {ContentComponentToRender && activeTabId && (
                    <TabContentArea>
                        <ContentComponentToRender
                            data={panelData.panelTypeData}
                            isContentAreaCollapsed={isContentAreaCollapsed}
                        />
                    </TabContentArea>
                )}
            </MainContentWrapper>
        </PanelOuterWrapper>
    );
};
