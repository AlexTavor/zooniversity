// ToolButton.tsx
import React from 'react';
import styled from '@emotion/styled';
import { Icon } from './../icons/Icon'; 
import { ToolType } from '../../../../game/display/game/tools/GameTools';


const toolIconMap: Partial<Record<ToolType, string>> = {
  [ToolType.Selection]: 'assets/icons/selection_tool.svg',
  [ToolType.TreeCutting]: 'assets/icons/axe_icon.png',
};

interface ToolButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The type of tool this button represents. Used for icon lookup. */
  toolType: ToolType;
  /** True if this tool is currently active/selected. */
  isActive: boolean;
  /** Accessible label for the button, also used for tooltip. */
  title: string;
  /** CSS size string (e.g., '48px', '3rem'). Defines width and height. */
  size?: string;
  /** Color for the border when the button is active. */
  activeBorderColor?: string;
  /** Background color when the button is active. */
  activeBackgroundColor?: string;
  /** Default background color for the icon (passed to base Icon). */
  iconBackgroundColor?: string;
  /** Default border color for the icon (passed to base Icon if not active). */
  iconBorderColor?: string;
}

const StyledToolButton = styled.button<{
  buttonSize: string;
  isActive: boolean;
  activeBgColor: string;
  activeBdrColor: string;
  // Normal state colors are handled by the Icon component's defaults or passed props
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.buttonSize};
  height: ${props => props.buttonSize};
  padding: 0; /* Icon component will have its own padding/sizing */
  border: none; /* Reset browser default button border */
  background-color: transparent; /* Wrapper is transparent, Icon handles its own background */
  cursor: pointer;
  transition: transform 0.1s ease-out, box-shadow 0.1s ease-out;

  /* Styling for the Icon component based on isActive can be done by passing different props
     or the Icon component itself could be made aware of an isActive prop.
     Here, we mainly style the button wrapper if needed.
     The primary visual change for active state will be on the Icon's border/bg.
  */

  &:hover:not(:disabled):not(:active) {
    /* Subtle hover effect on the button wrapper if desired, e.g., a slight scale or shadow */
    /* transform: scale(1.05); */
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5; /* Applied to the whole button including the Icon */
  }

  /* For an inset shadow effect on the button itself when active, similar to .action-button.active */
  ${({ isActive, activeBgColor }) =>
    isActive &&
    `
    box-shadow: inset 0 0 6px 2px rgba(255, 255, 255, 0.7); /* Example active style */
    /* background-color: ${activeBgColor}; // Optionally change wrapper background */
  `}
`;

export const ToolButton: React.FC<ToolButtonProps> = ({
  toolType,
  isActive,
  title,
  size = '48px',
  activeBorderColor = '#FFD700',
  activeBackgroundColor = 'rgba(0, 0, 0, 0.2)',
  iconBackgroundColor,
  iconBorderColor,
  onClick,
  disabled,
  className,
  ...rest
}) => {
  const iconSrc = toolIconMap[toolType] || 'assets/icons/unknown_tool.svg';

  return (
    <StyledToolButton
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={isActive}
      buttonSize={size}
      isActive={isActive}
      activeBgColor={activeBackgroundColor}
      activeBdrColor={activeBorderColor}
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...rest}
    >
      <Icon
        iconSrc={iconSrc}
        shape="square"
        size="100%"
        backgroundColor={isActive ? activeBackgroundColor : iconBackgroundColor}
        borderColor={isActive ? activeBorderColor : iconBorderColor}
        alt=""
      />
    </StyledToolButton>
  );
};