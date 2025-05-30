// src/ui/needs/NeedBar.tsx
import React from 'react'; // Removed useState, useEffect
import styled from '@emotion/styled';
import { Fillbar } from '../Fillbar';
import { NeedType, needDisplayInfoMap, formatChangeRate } from './NeedTypes';

export interface NeedUIData {
  type: NeedType;
  current: number;
  max: number;
  changeRatePerHour: number;
  fillColorOverride?: string;
}

interface NeedBarProps {
  needData: NeedUIData;
  isCollapsed: boolean;
  barOverallHeight?: string;
  fillbarWidth?: string;
  positiveRateColor?: string;
  negativeRateColor?: string;
  neutralRateColor?: string;
  labelColor?: string;
}

const NeedBarWrapper = styled.div<{ height: string }>`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  width: 100%;
  height: ${props => props.height};
`;

const FillbarContainer = styled.div<{ width: string }>`
  width: ${props => props.width};
  flex-shrink: 0;
`;

const InfoRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  flex-grow: 1;
  min-width: 0;
`;

const NeedLabel = styled.span<{ color: string }>`
  font-size: 0.8rem;
  font-weight: 500;
  color: ${props => props.color};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChangeRateText = styled.span<{ color: string }>`
  font-size: 0.7rem;
  font-style: italic;
  color: ${props => props.color};
`;

export const NeedBar: React.FC<NeedBarProps> = ({
  needData,
  isCollapsed,
  barOverallHeight = '24px',
  fillbarWidth = '60%',
  positiveRateColor = '#2ECC71',
  negativeRateColor = '#E74C3C',
  neutralRateColor = '#BDC3C7',
  labelColor = '#ECF0F1',
}) => {
  // Directly use needData.current and needData.max from props
  const { current, max, type, changeRatePerHour, fillColorOverride } = needData;

  const displayInfo = needDisplayInfoMap[type] || {
    label: type.toString(),
    defaultFillColor: '#7F8C8D',
  };

  const rateColor =
    changeRatePerHour > 0 ? positiveRateColor :
    changeRatePerHour < 0 ? negativeRateColor :
    neutralRateColor;

  const fillbarVisualHeight = isCollapsed ? `calc(${barOverallHeight} * 0.7)` : `calc(${barOverallHeight} * 0.5)`;

  return (
    <NeedBarWrapper height={barOverallHeight}>
      <FillbarContainer width={isCollapsed ? '100%' : fillbarWidth}>
        <Fillbar
          currentValue={current} 
          maxValue={max}
          fillColor={fillColorOverride || displayInfo.defaultFillColor}
          height={fillbarVisualHeight}
          width="50%"
        />
      </FillbarContainer>
      {!isCollapsed && (
        <InfoRow>
          <NeedLabel color={labelColor} title={displayInfo.label}>
            {displayInfo.label}
          </NeedLabel>
          <ChangeRateText color={rateColor}>
          {current}/{max} - {formatChangeRate(changeRatePerHour)}
          </ChangeRateText>
        </InfoRow>
      )}
    </NeedBarWrapper>
  );
};