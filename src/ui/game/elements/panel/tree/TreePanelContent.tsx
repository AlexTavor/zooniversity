// src/ui/panel/content_views/tree/TreeInfoContent.tsx
import React from 'react';
import styled from '@emotion/styled';
import { TimberSection } from './TimberSection'; // Adjust path
import { ForagingSection } from './ForagingSection'; // Adjust path
import { TreePanelUIData } from '../../../../../game/display/data_panel/tree/treePanelReducer';

interface TreeInfoContentProps {
  data: TreePanelUIData;
}

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px; /* Space between sections */
  height: 100%;
  padding: 5px 2px; /* Minimal padding to align with section internal paddings */
`;

const NoDataMessage = styled.div`
  font-size: 0.9rem;
  color: #888;
  font-style: italic;
  text-align: center;
  padding: 20px;
`;

export const TreePanelContent: React.FC<TreeInfoContentProps> = ({ data }) => {
  const { harvestableInfo, foragableInfo, displayName } = data;

  if (!harvestableInfo && !foragableInfo) {
    return <NoDataMessage>{displayName} has no current actions or yields.</NoDataMessage>;
  }

  return (
    <ContentWrapper>
      {harvestableInfo && (
        <TimberSection
          data={harvestableInfo}
        />
      )}
      {foragableInfo && (
        <ForagingSection
          data={foragableInfo}
        />
      )}
    </ContentWrapper>
  );
};