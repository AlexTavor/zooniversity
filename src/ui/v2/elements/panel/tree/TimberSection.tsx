// src/ui/panel/content_views/tree/TimberSection.tsx
import React from 'react';
import styled from '@emotion/styled';
import { TreeHarvestableUIData } from '../../../../../game/display/game/data_panel/tree/treePanelReducer';
import { ResourceType } from '../../../../../game/logic/resources/ResourceType';
import { ResourceConfig } from '../../../../../game/logic/resources/ResourceConfig';
import { Fillbar } from '../../Fillbar';
import { Icon } from '../../icons/Icon';

interface TimberSectionProps {
  data: TreeHarvestableUIData;
  resourceIconSize?: string;
  fillbarHeight?: string;
  fillbarWidth?: string; // Width for the fillbar itself
  titleColor?: string;
  textColor?: string;
}

const markedForCuttingIconSrc = 'assets/icons/axe_icon.png'; // Path to the small icon for "marked for cutting"

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TitleLine = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 24px; // Fixed height for the title line
`;

const SectionHeader = styled.h4`
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const ContentLine = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-size: 0.85rem;
  width: 100%;
`;

const LabelText = styled.span`
  flex-shrink: 0;
  width: 24px;
`;

const HitpointsText = styled.span`
  flex-shrink: 0;
  min-width: 40px; // To prevent jumpiness with 1/2/3 digit numbers
  text-align: right;
`;

const FillbarInLineWrapper = styled.div<{ width: string }>`
  width: ${props => props.width};
  flex-shrink: 1; // Allow fillbar to shrink if space is needed
  min-width: 50px; // Minimum width for the fillbar
`;

const YieldGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 64px;
  flex-shrink: 0;
`;


export const TimberSection: React.FC<TimberSectionProps> = ({
  data,
  resourceIconSize = '24px',
  fillbarHeight = '10px',
  fillbarWidth = '80px', // Default width for the fillbar element itself
  titleColor = '#888c99',
  textColor = '#c0c0c0',
}) => {
  const {
    hitpointsCurrent,
    hitpointsMax,
    yield: woodYieldData,
    isSelectedForCutting,
  } = data;

  const primaryWoodYield = woodYieldData.find(drop => drop.type === ResourceType.WOOD) || (woodYieldData.length > 0 ? woodYieldData[0] : null);
  const woodResourceDetails = primaryWoodYield ? ResourceConfig[primaryWoodYield.type as ResourceType] : null;

  return (
    <SectionWrapper>
      <TitleLine>
        <SectionHeader style={{ color: titleColor }}>TIMBER</SectionHeader>
        {isSelectedForCutting && markedForCuttingIconSrc && (
          <Icon iconSrc={markedForCuttingIconSrc} shape="square" size="24px" alt="Marked for Cutting" backgroundColor="transparent" borderColor="transparent"/>
        )}
      </TitleLine>
      <ContentLine style={{ color: textColor }}>
        <LabelText>Cut</LabelText>
        <FillbarInLineWrapper width={fillbarWidth}>
          <Fillbar
            currentValue={hitpointsCurrent}
            maxValue={hitpointsMax}
            height={fillbarHeight}
            width="100%" // Fillbar takes full width of its wrapper
            fillColor="#A0522D"
            barBackgroundColor="#593622"
            // No label prop for Fillbar here
          />
        </FillbarInLineWrapper>
        <HitpointsText>{hitpointsCurrent}/{hitpointsMax}</HitpointsText>
        
        {primaryWoodYield && woodResourceDetails && (
          <YieldGroup>
            <LabelText style={{paddingRight:"8px"}}>Yield</LabelText>
            <Icon iconSrc={woodResourceDetails.icon} shape="square" size={resourceIconSize} alt={primaryWoodYield.type} backgroundColor="transparent" borderColor="transparent" />
            <span>{primaryWoodYield.amount}</span>
          </YieldGroup>
        )}
      </ContentLine>
    </SectionWrapper>
  );
};