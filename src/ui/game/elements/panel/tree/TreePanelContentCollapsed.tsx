// src/ui/panel/content_views/tree/TreePanelContentCollapsed.tsx
import React from 'react';
import styled from '@emotion/styled';
import { TreePanelUIData } from '../../../../../game/display/data_panel/tree/treePanelReducer';
import { Fillbar } from '../../Fillbar';
import { Icon } from '../../icons/Icon';
import { ResourceConfig } from '../../../../../game/logic/resources/ResourceConfig';
import { ResourceType } from '../../../../../game/logic/resources/ResourceType';

interface TreePanelContentCollapsedProps {
  data: TreePanelUIData;
}

const CollapsedWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 2px 4px;
  height: 24px;
  width: 100%;
  overflow: hidden;
`;

const CollapsedSection = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  min-width: 0;
  flex: 0.5;
`;

const StyledFillbar = styled(Fillbar)`
  flex-shrink: 1;
  min-width: 50px;
  max-width: 80px;
`;

const YieldText = styled.span`
  font-size: 0.8rem;
  color: #c0c0c0;
  white-space: nowrap;
`;

const markedForCuttingIconSrc = 'assets/icons/axe_icon.png';

export const TreePanelContentCollapsed: React.FC<TreePanelContentCollapsedProps> = ({ data }) => {
  const { harvestableInfo, foragableInfo } = data;

  const primaryWoodYield = harvestableInfo?.yield.find(drop => drop.type === ResourceType.WOOD);
  const woodResourceDetails = primaryWoodYield ? ResourceConfig[primaryWoodYield.type as ResourceType] : null;
  const foodResourceDetails = foragableInfo ? ResourceConfig[foragableInfo.resourceType] : null;

  return (
    <CollapsedWrapper>
      {/* --- Timber Section --- */}
      {harvestableInfo && (
        <CollapsedSection title={`Health: ${harvestableInfo.hitpointsCurrent}/${harvestableInfo.hitpointsMax}`}>
          {harvestableInfo.isSelectedForCutting && (
            <Icon iconSrc={markedForCuttingIconSrc} shape="square" size="16px" alt="Marked for Cutting" backgroundColor="transparent" borderColor="transparent" />
          )}
          <StyledFillbar
            currentValue={harvestableInfo.hitpointsCurrent}
            maxValue={harvestableInfo.hitpointsMax}
            height="6px"
            width="100%"
            fillColor="#A0522D"
            barBackgroundColor="#593622"
          />
          {primaryWoodYield && woodResourceDetails && (
            <>
              <Icon iconSrc={woodResourceDetails.icon} shape="square" size="16px" alt={primaryWoodYield.type} backgroundColor="transparent" borderColor="transparent" />
              <YieldText>{primaryWoodYield.amount}</YieldText>
            </>
          )}
        </CollapsedSection>
      )}

      {/* --- Foraging Section --- */}
      {foragableInfo && foodResourceDetails && (
        <CollapsedSection title={`Forageable: ${Math.floor(foragableInfo.currentAmount)}/${foragableInfo.maxAmount}`}>
          <Icon iconSrc={foodResourceDetails.icon} shape="square" size="16px" alt={foragableInfo.resourceType} backgroundColor="transparent" borderColor="transparent" />
          <StyledFillbar
            currentValue={foragableInfo.currentAmount}
            maxValue={foragableInfo.maxAmount}
            height="6px"
            width="100%"
            fillColor="#2ECC71"
            barBackgroundColor="#4A2E0D"
          />
        </CollapsedSection>
      )}
    </CollapsedWrapper>
  );
};