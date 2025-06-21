import React from "react";
import styled from "@emotion/styled";
import { TabButton } from "../buttons/TabButton";
import { PanelType } from "../../../../game/display/setup/ViewDefinition";
import { TABS_CONFIG } from "./TabTypes";

interface SelectionTabBarProps {
    panelType: PanelType | null;
    activeTabId: string | null;
    onTabSelect: (tabId: string) => void;
    className?: string;
    tabButtonHeight?: string;
    tabButtonPadding?: string;
}

const TabBarWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    padding: 0 4px; /* Horizontal padding for the bar */
    gap: 2px; /* Small gap between tabs */
    overflow-x: auto; /* If many tabs, allow horizontal scrolling */
    scrollbar-width: thin; /* For Firefox */
    scrollbar-color: rgba(255, 255, 255, 0.2) rgba(0, 0, 0, 0.1); /* For Firefox */

    &::-webkit-scrollbar {
        height: 6px; /* Height of horizontal scrollbar */
    }
    &::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
    }
    &::-webkit-scrollbar-track {
        background-color: rgba(0, 0, 0, 0.1);
    }
`;

export const SelectionTabBar: React.FC<SelectionTabBarProps> = ({
    panelType,
    activeTabId,
    onTabSelect,
    className,
    tabButtonHeight = "30px",
    tabButtonPadding = "0 8px",
}) => {
    if (!panelType) {
        return null;
    }

    const availableTabs = TABS_CONFIG[panelType] || [];

    if (availableTabs.length === 0) {
        return null; // No tabs defined for this panel type
    }

    return (
        <TabBarWrapper className={className}>
            {availableTabs.map((tab) => (
                <TabButton
                    key={tab.id}
                    label={tab.label}
                    iconSrc={tab.iconSrc}
                    isActive={activeTabId === tab.id}
                    onClick={() => onTabSelect(tab.id)}
                    height={tabButtonHeight}
                    padding={tabButtonPadding}
                />
            ))}
        </TabBarWrapper>
    );
};
