// src/ui/panel/content_views/character/CharacterInfoContentCollapsed.tsx
import React from "react";
import styled from "@emotion/styled";
import { CharacterAction } from "../../../../../game/logic/intent/intent-to-action/actionIntentData";
import { ActionIcon } from "../../icons/ActionIcon";
import { NeedUIData } from "../../needs/NeedBar";
import { NeedsDisplay } from "../../needs/NeedsDisplay";
import {
    ScheduleUIData,
    ScheduleDisplay,
} from "../../schedule/ScheduleDisplay";
import { StatusEffectsDisplay } from "../../status/StatusEffectsDisplay";
import { UIStatusEffectData } from "../../status/StatusLine";

// Data structure expected for this component (subset of CharacterInfoData)
export interface CharacterInfoCollapsedData {
    schedule: ScheduleUIData;
    currentAction: { type: CharacterAction; description: string }; // Description might be used for tooltip
    statusEffects: UIStatusEffectData[];
    needs: NeedUIData[];
}

interface CharacterInfoContentCollapsedProps {
    data: CharacterInfoCollapsedData;
}

const CollapsedContentWrapper = styled.div`
    display: flex;
    align-items: center; /* Vertically align all items in the row */
    justify-content: space-between; /* Distribute space between major groups */
    gap: 8px; /* Gap between major groups */
    padding: 2px 4px; /* Minimal padding for the entire line */
    height: 100%; /* Take full height of its container (e.g., a fixed small height from TabContentArea) */
    width: 100%;
    overflow: hidden; /* Prevent internal elements from overflowing the fixed height */
`;

const CollapsedSection = styled.div`
    display: flex;
    align-items: center;
    gap: 4px; /* Gap within a section (e.g., between icons in schedule or buffs) */
    /* flex-shrink: 0; // Prevent sections from shrinking too much if space is tight */
    min-width: 0; /* Allows flex items to shrink below their content size */
    height: 24px;
`;

const ActionSection = styled(CollapsedSection)`
    /* Action might need a bit more space or specific alignment if text is shown */
    flex-shrink: 1; /* Allow action text to shrink/truncate if needed */
    overflow: hidden;
`;

const NeedsStackCollapsed = styled.div`
    display: flex;
    flex-direction: column; /* Stack needs vertically */
    align-items: flex-end; /* Align to the right if desired */
    gap: 1px; /* Minimal gap between tiny need bars */
    width: 40px;
    margin-right: 8px;
`;

export const CharacterInfoContentCollapsed: React.FC<
    CharacterInfoContentCollapsedProps
> = ({ data }) => {
    const { schedule, currentAction, statusEffects, needs } = data;

    return (
        <CollapsedContentWrapper title={currentAction.description}>
            <CollapsedSection className="schedule-collapsed-section">
                <ScheduleDisplay
                    scheduleData={{
                        slots: schedule.slots,
                        currentSlotIndex: schedule.currentSlotIndex,
                    }}
                    iconSize="16px" // Smaller icons for collapsed view
                />
            </CollapsedSection>

            <ActionSection className="action-collapsed-section">
                <ActionIcon actionType={currentAction.type} size="18px" />
                {/* Optionally display a very short version of action text, or rely on tooltip */}
                {/* <ActionDescriptionCollapsed>{currentAction.description}</ActionDescriptionCollapsed> */}
            </ActionSection>

            <CollapsedSection className="buffs-collapsed-section">
                {/* StatusEffectsDisplay will render multiple BuffDebuffIcons horizontally */}
                <StatusEffectsDisplay
                    isCollapsed={true}
                    effects={statusEffects}
                    iconSize="16px"
                />
            </CollapsedSection>

            <CollapsedSection className="needs-collapsed-section">
                {/* NeedsDisplay will render multiple Fillbars (collapsed version) vertically */}
                <NeedsStackCollapsed>
                    <NeedsDisplay
                        needs={needs}
                        isCollapsed={true}
                        collapsedBarOverallHeight="4px" // Very thin bars
                    />
                </NeedsStackCollapsed>
            </CollapsedSection>
        </CollapsedContentWrapper>
    );
};
