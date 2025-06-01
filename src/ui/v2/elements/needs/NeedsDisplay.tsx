import React from 'react';
import styled from '@emotion/styled';
import { NeedBar, NeedUIData } from './NeedBar';

interface NeedsDisplayProps {
  needs: NeedUIData[];
  isCollapsed: boolean;
  className?: string;

  // --- Styling props passed down to NeedBar ---
  // Overall height for each NeedBar row
  openBarOverallHeight?: string;
  collapsedBarOverallHeight?: string;

  // Width for the Fillbar part within NeedBar when open
  openFillbarWidth?: string; // When collapsed, NeedBar makes its fillbar 100%

  // Colors for changeRatePerHour text and labels
  positiveRateColor?: string;
  negativeRateColor?: string;
  neutralRateColor?: string;
  labelColor?: string;
}

const NeedsDisplayWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 2px 0; /* Minimal vertical padding */
  box-sizing: border-box;
`;

export const NeedsDisplay: React.FC<NeedsDisplayProps> = ({
  needs,
  isCollapsed,
  className,
  openBarOverallHeight = '24px',    // Default for open state
  collapsedBarOverallHeight = '8px', // Default for collapsed state
  openFillbarWidth = '60%',       // Default fillbar width in open state
  // Colors for rate/label are passed to NeedBar, which has its own defaults
  positiveRateColor,
  negativeRateColor,
  neutralRateColor,
  labelColor,
}) => {
  const currentBarOverallHeight = isCollapsed ? collapsedBarOverallHeight : openBarOverallHeight;
  // In collapsed mode, NeedBar itself will set its fillbar container to 100% width.
  // In open mode, we pass the specified openFillbarWidth.
  const currentFillbarWidthForChild = isCollapsed ? '100%' : openFillbarWidth;


  if (!needs || needs.length === 0) {
    return null;
  }

  return (
    <NeedsDisplayWrapper className={className}>
      {needs.map((needData) => (
        <NeedBar
          key={needData.type} // Assuming NeedType is unique per character's need list
          needData={needData}
          isCollapsed={isCollapsed}
          barOverallHeight={currentBarOverallHeight}
          fillbarWidth={currentFillbarWidthForChild} // This prop is used by NeedBar for its FillbarContainer
          positiveRateColor={positiveRateColor}
          negativeRateColor={negativeRateColor}
          neutralRateColor={neutralRateColor}
          labelColor={labelColor}
        />
      ))}
    </NeedsDisplayWrapper>
  );
};