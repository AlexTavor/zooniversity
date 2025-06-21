// src/ui/status/StatusLine.tsx
import React from "react";
import styled from "@emotion/styled";
import { BuffDebuffIcon } from "../icons/BuffDebuffIcon"; // Adjust path as needed
import {
    AffectedStat,
    BuffEffectApplicationType,
} from "../../../../game/logic/buffs/buffsData";

export interface UIBuffEffect {
    stat: AffectedStat;
    value: number;
    applicationType: BuffEffectApplicationType;
    effectText: string;
}

export interface UIStatusEffectData {
    iconAssetKey: string;
    displayName: string;
    description?: string;
    effects: UIBuffEffect[];
    remainingDurationMinutes?: number;
    totalDurationMinutes?: number;
    isBuff: boolean;
    key: string;
}

interface StatusLineProps {
    effectData: UIStatusEffectData;
    className?: string;
    iconSize?: string;
    positiveTextColor?: string;
    negativeTextColor?: string;
    buffIconFillColor?: string;
    debuffIconFillColor?: string;
    iconBackgroundColor?: string;
    iconBorderColor?: string;
    isCollapsed?: boolean;
}

const StatusLineWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 4px 0;
    gap: 8px;
    width: 100%;
`;

const EffectsText = styled.span<{ textColor: string }>`
    font-size: 0.85rem;
    color: ${(props) => props.textColor};
    line-height: 1.3;
    flex-grow: 1;
    white-space: normal;
`;

export const StatusLine: React.FC<StatusLineProps> = ({
    effectData,
    className,
    iconSize = "20px",
    positiveTextColor = "#2ECC71",
    negativeTextColor = "#E74C3C",
    buffIconFillColor,
    debuffIconFillColor,
    iconBackgroundColor,
    iconBorderColor,
    isCollapsed,
}) => {
    const {
        iconAssetKey,
        displayName,
        effects,
        remainingDurationMinutes,
        totalDurationMinutes,
        isBuff,
    } = effectData;

    const fullEffectText = effects.map((eff) => eff.effectText).join(", ");
    const textColor = isBuff ? positiveTextColor : negativeTextColor;

    return (
        <StatusLineWrapper
            className={className}
            title={displayName || effectData.description}
        >
            <BuffDebuffIcon
                iconAssetKey={iconAssetKey}
                altText={displayName || "Status Effect"}
                remainingDurationMinutes={remainingDurationMinutes}
                totalDurationMinutes={totalDurationMinutes}
                isBuff={isBuff}
                size={iconSize}
                buffFillColor={buffIconFillColor}
                debuffFillColor={debuffIconFillColor}
                backgroundColor={iconBackgroundColor}
                borderColor={iconBorderColor}
            />
            {!isCollapsed ? (
                <EffectsText textColor={textColor}>
                    {displayName} : {fullEffectText || displayName}
                </EffectsText>
            ) : null}
        </StatusLineWrapper>
    );
};
