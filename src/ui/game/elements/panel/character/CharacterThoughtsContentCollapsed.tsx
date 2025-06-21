import React from 'react';
import styled from '@emotion/styled';

export interface CharacterThoughtsCollapsedData {
  currentStatusText: string;
}

interface CharacterThoughtsContentCollapsedProps {
  data: CharacterThoughtsCollapsedData;
}

const CollapsedStatusText = styled.p`
  margin: 0;
  font-size: 0.85rem; /* Slightly smaller for collapsed view */
  line-height: 1.3;
  color: #b0b0b0; /* Slightly muted color */
  font-style: italic;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* Truncate if too long */
  padding: 0px;
`;

export const CharacterThoughtsContentCollapsed: React.FC<CharacterThoughtsContentCollapsedProps> = ({ data }) => {
  const { currentStatusText } = data;

  return (
    <CollapsedStatusText title={currentStatusText}>
      {currentStatusText}
    </CollapsedStatusText>
  );
};