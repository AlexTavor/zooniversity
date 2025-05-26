// ScheduleIcon.tsx
import React from 'react';
// import styled from '@emotion/styled'; // Not strictly needed if all styling is handled by Icon component
import { Icon } from './Icon'; // Assuming Icon.tsx is in the same directory or adjust path
import { CharacterIntent } from '../../../../game/logic/action-intent/actionIntentData'; // Adjust path as needed

export type ScheduleActivityType = CharacterIntent;

const scheduleIconMap: Partial<Record<ScheduleActivityType, string>> = {
  [CharacterIntent.NONE]: 'assets/icons/idle_icon.png',
  [CharacterIntent.HARVEST]: 'assets/icons/axe_icon.png',
  [CharacterIntent.BUILD]: 'assets/icons/build_icon.png',
  [CharacterIntent.SLEEP]: 'assets/icons/sleep_icon.png',
  [CharacterIntent.REST]: 'assets/icons/relax_icon.png',
  [CharacterIntent.STUDY]: 'assets/icons/book_icon.png',
};

interface ScheduleIconProps {
  /** The type of scheduled activity to display an icon for. */
  activityType: ScheduleActivityType;
  /** True if this schedule slot is currently active or highlighted. */
  isActive: boolean;
  /** CSS size string (e.g., '24px', '2rem'). Will be applied to width and height. */
  size: string;
  /** Optional additional CSS class name(s). */
  className?: string;
  /** Optional override for background color. */
  backgroundColor?: string;
  /** Optional override for border color when inactive. */
  borderColor?: string;
  /** Optional override for border width. */
  borderWidth?: string;
  /** Color for the border when the icon is active. */
  activeBorderColor?: string;
  /** Opacity when the icon is not active (e.g. for past/future schedule items) */
  inactiveOpacity?: number;
  /** Alt text for the icon image. Defaults to the activity type. */
  alt?: string;
}

export const ScheduleIcon: React.FC<ScheduleIconProps> = ({
  activityType,
  isActive,
  size,
  className,
  backgroundColor, // Default from Icon component if not provided
  borderColor,     // Default from Icon component if not provided
  borderWidth,     // Default from Icon component if not provided
  activeBorderColor = 'rgba(255, 215, 0, 0.9)', // Default gold for active
  inactiveOpacity = 0.7,
  alt,
}) => {
  const iconSrc = scheduleIconMap[activityType] || 'assets/icons/unknown_schedule_icon.png'; // Fallback icon

  const currentBorderColor = isActive ? activeBorderColor : borderColor;
  const currentOpacity = isActive ? 1 : inactiveOpacity;

  return (
    <Icon
      iconSrc={iconSrc}
      shape="square"
      size={size}
      backgroundColor={backgroundColor}
      borderColor={currentBorderColor}
      borderWidth={borderWidth}
      className={className}
      opacity={currentOpacity }
      alt={alt || CharacterIntent[activityType] || 'Scheduled Activity'} // Default alt text
    />
  );
};