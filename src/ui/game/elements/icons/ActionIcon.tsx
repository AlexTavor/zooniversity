// ActionIcon.tsx
import React from 'react';
import { Icon } from './Icon';
import { CharacterAction } from '../../../../game/logic/intent/intent-to-action/actionIntentData';
import { actionIconMap } from './actionIconMap';

interface ActionIconProps {
  /** The type of action to display an icon for. */
  actionType: CharacterAction;
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
  /** Alt text for the icon image. Defaults to the action type. */
  alt?: string;
}

export const ActionIcon: React.FC<ActionIconProps> = ({
  actionType,
  size,
  className,
  backgroundColor, // Allow overriding base Icon defaults if needed
  borderColor,
  borderWidth,
  alt,
}) => {
  const iconSrc = actionIconMap[actionType] || 'assets/icons/unknown_action_icon.png'; // Fallback icon

  return (
    <Icon
      iconSrc={iconSrc}
      shape="circle"
      size={size}
      backgroundColor={backgroundColor} // Pass down or use Icon's default
      borderColor={borderColor}         // Pass down or use Icon's default
      borderWidth={borderWidth}         // Pass down or use Icon's default
      className={className}
      alt={alt || actionType.toString()} // Default alt text to the action type
    />
  );
};