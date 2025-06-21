// src/ui/panel/content_views/character/CharacterInfoContent.tsx
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
import { DisplayableBuffData } from "../../../../../game/display/data_panel/character/deriveBuffs";

// Data structure expected for this component
export interface CharacterInfoData {
    schedule: ScheduleUIData;
    currentAction: { type: CharacterAction; description: string }; // Or CurrentActionUIData
    needs: NeedUIData[];
    statusEffects: DisplayableBuffData[];
}

interface CharacterInfoContentProps {
    data: CharacterInfoData;
}

const InfoContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px; /* Space between major sections */
    height: 100%;
    padding: 5px;
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px; /* Space between header and content within a section */
`;

const SectionHeader = styled.h4`
    margin: 0 0 2px 0;
    font-size: 0.75rem;
    font-weight: 600;
    color: #888c99; /* Muted header color */
    text-transform: uppercase;
    padding-bottom: 2px;
    border-bottom: 1px solid #3a3c3e;
`;

const TopRow = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px; /* Space between Schedule and Current Action sections */
    min-height: 0; /* For flex children */
`;

const TopRowSection = styled(Section)`
    flex: 1; /* Distribute space, or use fixed widths */
    min-width: 0; /* For flex children */
    &:first-of-type {
        flex-basis: 60%; /* Schedule takes more space */
    }
    &:last-of-type {
        flex-basis: 25%; /* Current Action takes less */
    }
`;

const CurrentActionDisplay = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    gap: 6px;
    font-size: 0.85rem;
    color: #c0c0c0;
    line-height: 1.3;
`;

const ActionDescription = styled.span`
    white-space: normal; /* Allow wrapping */
`;

export const CharacterInfoContent: React.FC<CharacterInfoContentProps> = ({
    data,
}) => {
    const { schedule, currentAction, needs, statusEffects } = data;

    return (
        <InfoContentWrapper>
            <TopRow>
                <TopRowSection>
                    <SectionHeader>Schedule</SectionHeader>
                    <ScheduleDisplay scheduleData={schedule} iconSize="24px" />
                </TopRowSection>
                <TopRowSection>
                    <SectionHeader>Current Action</SectionHeader>
                    <CurrentActionDisplay>
                        <ActionIcon
                            actionType={currentAction.type}
                            size="24px"
                        />
                        <ActionDescription>
                            {currentAction.description}
                        </ActionDescription>
                    </CurrentActionDisplay>
                </TopRowSection>
            </TopRow>

            <Section>
                <SectionHeader>Needs</SectionHeader>
                <NeedsDisplay
                    needs={needs}
                    isCollapsed={false}
                    openBarOverallHeight="20px"
                />
            </Section>

            <Section>
                <SectionHeader>Status Effects</SectionHeader>
                <StatusEffectsDisplay
                    isCollapsed={false}
                    effects={statusEffects}
                    iconSize="18px"
                />
            </Section>
        </InfoContentWrapper>
    );
};
