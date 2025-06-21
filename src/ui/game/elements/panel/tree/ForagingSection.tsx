// src/ui/panel/content_views/tree/ForagingSection.tsx
import React from "react";
import styled from "@emotion/styled";
import { TreeForagableUIData } from "../../../../../game/display/data_panel/tree/treePanelReducer";
import { ResourceConfig } from "../../../../../game/logic/resources/ResourceConfig";
import { Fillbar } from "../../Fillbar";
import { Icon } from "../../icons/Icon";

interface ForagingSectionProps {
    data: TreeForagableUIData;
    isMarkedForForaging?: boolean;
    resourceIconSize?: string;
    fillbarHeight?: string;
    fillbarWidth?: string; // Width for the fillbar element itself
    titleColor?: string;
    textColor?: string;
    regenTextColor?: string;
}

const markedForForagingIconSrc = "assets/icons/forage_icon.png"; // Example path

const SectionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const TitleLine = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
`;

const SectionHeader = styled.h4`
    margin: 0;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    flex-grow: 1;
`;

const ContentLine = styled.div`
    display: flex;
    align-items: baseline; /* Align items to the baseline for better text alignment */
    gap: 6px; /* Reduced gap for tighter layout */
    justify-content: flex-start; /* Align all items to the left */
    font-size: 0.85rem;
`;

const ResourceIconWrapper = styled.div`
    flex-shrink: 0;
`;

const FillbarInLineWrapper = styled.div<{ width: string }>`
    width: ${(props) => props.width};
    flex-shrink: 0; /* Fillbar has a defined width */
`;

const AmountText = styled.span`
    flex-shrink: 0;
    min-width: 35px; /* Space for X/Y text */
    text-align: left;
`;

const RegenText = styled.span`
    font-size: 0.8rem;
    white-space: nowrap;
    flex-shrink: 0;
`;

export const ForagingSection: React.FC<ForagingSectionProps> = ({
    data,
    isMarkedForForaging = false,
    resourceIconSize = "24px",
    fillbarHeight = "10px",
    fillbarWidth = "80px", // "Rather short fillbar"
    titleColor = "#888c99",
    textColor = "#c0c0c0",
    regenTextColor = "#7f8c8d",
}) => {
    const { resourceType, currentAmount, maxAmount, regenRatePerMinute } = data;

    const resourceConf = ResourceConfig[resourceType];
    const resourceIconSrc = resourceConf?.icon;
    // const resourceLabelForTitle = resourceConf?.description || resourceType.toString();

    const regenRatePerHour = (regenRatePerMinute * 60).toFixed(1);
    const amountText = `${Math.floor(currentAmount)}/${maxAmount}`;

    const foodFillColor = "#2ECC71"; // Green for food

    return (
        <SectionWrapper>
            <TitleLine>
                <SectionHeader style={{ color: titleColor }}>
                    FORAGING {/* Static title as per new layout */}
                </SectionHeader>
                {isMarkedForForaging && markedForForagingIconSrc && (
                    <Icon
                        iconSrc={markedForForagingIconSrc}
                        shape="square"
                        size="14px"
                        alt="Marked for Foraging"
                        backgroundColor="transparent"
                        borderColor="transparent"
                    />
                )}
            </TitleLine>
            <ContentLine style={{ color: textColor }}>
                {resourceIconSrc && (
                    <ResourceIconWrapper>
                        <Icon
                            iconSrc={resourceIconSrc}
                            shape="square"
                            size={resourceIconSize}
                            alt={resourceType.toString()}
                            backgroundColor="transparent"
                            borderColor="transparent"
                        />
                    </ResourceIconWrapper>
                )}
                <FillbarInLineWrapper width={fillbarWidth}>
                    <Fillbar
                        currentValue={currentAmount}
                        maxValue={maxAmount}
                        height={fillbarHeight}
                        width="100%" // Fillbar takes full width of its short wrapper
                        fillColor={foodFillColor} // Example color for food
                        barBackgroundColor="#4A2E0D" // Darker, earthy background
                        // No label prop for Fillbar here
                    />
                </FillbarInLineWrapper>
                <AmountText>{amountText}</AmountText>
                <RegenText style={{ color: regenTextColor }}>
                    (+{regenRatePerHour}/hr)
                </RegenText>
            </ContentLine>
        </SectionWrapper>
    );
};
