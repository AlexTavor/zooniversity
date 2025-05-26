// BuffDebuffIcon.tsx
import React from 'react';
import { Icon } from './Icon';

export enum StatusEffectType {
  RESTED = 'RESTED',
  HUNGRY = 'HUNGRY',
  INSPIRED = 'INSPIRED',
  STROLL_SPEED = 'STROLL_SPEED'
}

const buffDebuffIconMap: Partial<Record<StatusEffectType, string>> = {
  [StatusEffectType.RESTED]: 'assets/icons/sleep_icon.png',
  [StatusEffectType.HUNGRY]: 'assets/icons/food_icon_debuff.png',
  [StatusEffectType.INSPIRED]: 'assets/icons/inspired_icon.png',
  [StatusEffectType.STROLL_SPEED]: 'assets/icons/walk_icon.png',
};

interface BuffDebuffIconProps {
  /** The type of status effect to display an icon for. */
  statusEffectType: StatusEffectType;
  /** Current duration of the effect (e.g., in seconds or game ticks). */
  currentDuration?: number;
  /** Maximum duration of the effect. */
  maxDuration?: number;
  /** True if the effect is a buff, false if it's a debuff. Affects foreground fill color. */
  isBuff: boolean;
  /** CSS size string (e.g., '24px', '2rem'). Will be applied to width and height. */
  size: string;
  /** Optional additional CSS class name(s). */
  className?: string;
  /** Optional override for background color. */
  backgroundColor?: string;
  /** Optional override for border color. */
  borderColor?: string;
  /** Optional override for border width. */
  borderWidth?: string;
  /** Alt text for the icon image. Defaults to the status effect type. */
  alt?: string;
  /** Foreground color for buffs. */
  buffFillColor?: string;
  /** Foreground color for debuffs. */
  debuffFillColor?: string;
}

export const BuffDebuffIcon: React.FC<BuffDebuffIconProps> = ({
  statusEffectType,
  currentDuration,
  maxDuration,
  isBuff,
  size,
  className,
  backgroundColor,
  borderColor,
  borderWidth,
  alt,
  buffFillColor = 'rgba(76, 175, 80, 0.7)', // Default green for buffs
  debuffFillColor = 'rgba(244, 67, 54, 0.7)', // Default red for debuffs
}) => {
  const iconSrc = buffDebuffIconMap[statusEffectType] || 'assets/icons/unknown_status_icon.png'; // Fallback icon

  let foregroundFillPercent: number | undefined = undefined;
  if (typeof currentDuration === 'number' && typeof maxDuration === 'number' && maxDuration > 0) {
    foregroundFillPercent = Math.max(0, Math.min(currentDuration / maxDuration, 1));
  } else if (typeof currentDuration === 'number' && currentDuration > 0 && typeof maxDuration !== 'number') {
    // If it has a current duration but no max, assume it's fully filled (e.g. persistent toggle buffs)
    // Or handle as per specific game logic (e.g. infinite duration buffs might not show a fill)
    foregroundFillPercent = 1;
  }


  const foregroundColor = isBuff ? buffFillColor : debuffFillColor;

  return (
    <Icon
      iconSrc={iconSrc}
      shape="circle"
      size={size}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      borderWidth={borderWidth}
      foregroundColor={foregroundColor}
      foregroundFillPercent={foregroundFillPercent}
      className={className}
      alt={alt || statusEffectType.toString()}
    />
  );
};