// Fillbar.tsx
import React from "react";
import styled from "@emotion/styled";

interface FillbarProps {
    currentValue: number;
    maxValue: number;
    label?: string;
    fillColor?: string;
    barBackgroundColor?: string;
    height?: string;
    width?: string;
    className?: string; // For Emotion's className passthrough or external styling
    labelColor?: string;
}

const FillbarContainer = styled.div<{ barWidth: string }>`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 4px;
    width: ${(props) => props.barWidth};
`;

const FillbarLabel = styled.span<{ labelColor: string }>`
    font-size: 0.8rem;
    color: ${(props) => props.labelColor};
    margin-bottom: 2px;
`;

const FillbarBackground = styled.div<{ barHeight: string; bgColor: string }>`
    width: 100%;
    height: ${(props) => props.barHeight};
    background-color: ${(props) => props.bgColor};
    border-radius: 4px;
    overflow: hidden;
    position: relative;
`;

const FillbarFill = styled.div<{
    fillColor: string;
    barHeight: string;
}>`
    height: ${(props) => props.barHeight};
    background-color: ${(props) => props.fillColor};
    border-radius: 4px; /* Can be same as background or slightly less */
`;

export const Fillbar: React.FC<FillbarProps> = ({
    currentValue,
    maxValue,
    label,
    fillColor = "#4CAF50", // Default fill color
    barBackgroundColor = "#E0E0E0", // Default background color
    height = "10px",
    width = "100px",
    className,
    labelColor = "#FFFFFF", // Default label color
}) => {
    const percentage = maxValue > 0 ? (currentValue / maxValue) * 100 : 0;
    const cappedPercentage = Math.max(0, Math.min(percentage, 100));

    return (
        <FillbarContainer barWidth={width} className={className}>
            {label && (
                <FillbarLabel labelColor={labelColor}>{label}</FillbarLabel>
            )}
            <FillbarBackground barHeight={height} bgColor={barBackgroundColor}>
                <FillbarFill
                    style={{ width: `${cappedPercentage}%` }}
                    fillColor={fillColor}
                    barHeight={height}
                />
            </FillbarBackground>
        </FillbarContainer>
    );
};
