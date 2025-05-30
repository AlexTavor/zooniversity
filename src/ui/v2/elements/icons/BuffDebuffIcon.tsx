import React from 'react';
import { Icon } from './Icon';

export interface BuffDebuffIconProps {
  /** Direct path to the icon asset, from DisplayableBuffData.iconAssetKey. */
  iconAssetKey: string;
  /** Alt text for accessibility, from DisplayableBuffData.displayName or description. */
  altText: string;
  /** Remaining duration of the effect in minutes. */
  remainingDurationMinutes?: number;
  /** Total original duration of the effect in minutes. */
  totalDurationMinutes?: number;
  /** True if the effect is a buff, false if it's a debuff. */
  isBuff: boolean;
  /** CSS size string for the icon (e.g., '24px', '2rem'). */
  size: string;

  /** Optional additional CSS class name(s). */
  className?: string;
  /** Optional override for the icon's background color. */
  backgroundColor?: string;
  /** Optional override for the icon's border color. */
  borderColor?: string;
  /** Optional override for the icon's border width. */
  borderWidth?: string;
  /** Optional override for the foreground fill color for buffs. */
  buffFillColor?: string;
  /** Optional override for the foreground fill color for debuffs. */
  debuffFillColor?: string;
}

export const BuffDebuffIcon: React.FC<BuffDebuffIconProps> = ({
  iconAssetKey,
  altText,
  remainingDurationMinutes,
  totalDurationMinutes,
  isBuff,
  size,
  className,
  backgroundColor,
  borderColor,
  borderWidth,
  buffFillColor = 'rgba(76, 175, 80, 0.7)', // Default green for buff fill
  debuffFillColor = 'rgba(244, 67, 54, 0.7)', // Default red for debuff fill
}) => {
  let foregroundFillPercent: number | undefined = undefined;

  if (
    typeof remainingDurationMinutes === 'number' &&
    typeof totalDurationMinutes === 'number' &&
    totalDurationMinutes > 0
  ) {
    foregroundFillPercent = Math.max(0, Math.min(remainingDurationMinutes / totalDurationMinutes, 1));
  } else if (typeof remainingDurationMinutes === 'number' && remainingDurationMinutes > 0 && typeof totalDurationMinutes !== 'number') {
    // If it has a remaining duration but no total, assume it's fully filled (e.g., persistent toggle buffs)
    // or for buffs that don't deplete/have indefinite visual representation.
    foregroundFillPercent = 1;
  } else if (typeof remainingDurationMinutes === 'number' && remainingDurationMinutes <=0 && typeof totalDurationMinutes !== 'number') {
    // If remaining is zero or less, and no total duration, assume empty.
    foregroundFillPercent = 0;
  }


  const currentForegroundColor = isBuff ? buffFillColor : debuffFillColor;

  return (
    <Icon
      iconSrc={iconAssetKey}
      shape="circle"
      size={size}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      borderWidth={borderWidth}
      foregroundColor={currentForegroundColor}
      foregroundFillPercent={foregroundFillPercent}
      className={className}
      alt={altText}
    />
  );
};