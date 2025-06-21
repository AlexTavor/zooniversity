// TabButton.tsx
import React from 'react';
import styled from '@emotion/styled';
import { Icon } from '../icons/Icon';

interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Text label for the tab. Optional. */
  label?: string;
  /** Optional: Source path for an icon. Required if label is not provided. */
  iconSrc?: string;
  /** True if this tab is currently active/selected. */
  isActive: boolean;
  /** Accessible name for the button, defaults to the label or a generic tab description. */
  title?: string;
  /** CSS height string (e.g., '40px'). */
  height?: string;
  /** Min CSS width string (e.g., '40px' for icon-only, '100px' for text). */
  minWidth?: string;
  /** Padding for the button content. */
  padding?: string;
  /** Color for the border/background when the button is active. */
  activeColor?: string;
  /** Default text color. */
  textColor?: string;
  /** Text color when active. */
  activeTextColor?: string;
  /** Default background color for the active tab. */
  activeTabBackgroundColor?: string;
  /** Background color for inactive tabs. */
  inactiveTabBackgroundColor?: string;
}

const StyledTabButton = styled.button<{
  isActive: boolean;
  buttonHeight: string;
  buttonMinWidth: string;
  buttonPadding: string;
  activeColor: string;
  textColor: string;
  activeTextColor: string;
  activeBgColor: string;
  inactiveBgColor: string;
  hasLabel: boolean;
  hasIcon: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: ${props => (props.hasLabel && props.hasIcon ? 'flex-start' : 'center')}; /* Center if icon-only or label-only */
  height: ${props => props.buttonHeight};
  min-width: ${props => props.buttonMinWidth};
  padding: ${props => props.buttonPadding};
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  text-align: center;
  white-space: nowrap;

  border: 1px solid ${props => (props.isActive ? props.activeColor : 'transparent')};
  border-bottom: none;
  background-color: ${props => (props.isActive ? props.activeBgColor : props.inactiveBgColor)};
  color: ${props => (props.isActive ? props.activeTextColor : props.textColor)};

  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;

  &:hover:not(:disabled):not(.isActive) {
    background-color: ${props => props.isActive ? props.activeBgColor : 'rgba(255, 255, 255, 0.1)'};
    color: ${props => props.activeTextColor};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .tab-icon-element { /* Renamed class for clarity */
    margin-right: ${props => (props.hasLabel ? '8px' : '0')}; /* Space only if label exists */
  }
`;

export const TabButton: React.FC<TabButtonProps> = ({
  label,
  iconSrc,
  isActive,
  title,
  height = '36px',
  minWidth, // Default will be conditional
  padding = '0 12px',
  activeColor = '#FFD700',
  textColor = 'rgba(255, 255, 255, 0.7)',
  activeTextColor = '#FFFFFF',
  activeTabBackgroundColor = 'rgba(0, 0, 0, 0.9)',
  inactiveTabBackgroundColor = 'rgba(0, 0, 0, 0.3)',
  onClick,
  disabled,
  className,
  ...rest
}) => {
  if (!label && !iconSrc) {
    console.warn("TabButton: Either 'label' or 'iconSrc' must be provided.");
    return null;
  }

  const defaultMinWidth = label ? '80px' : `calc(${height} + 8px)`; // Adjust icon-only width based on height

  return (
    <StyledTabButton
      type="button"
      title={title || label || 'Tab'}
      aria-label={title || label || 'Tab'}
      aria-selected={isActive}
      role="tab"
      isActive={isActive}
      buttonHeight={height}
      buttonMinWidth={minWidth || defaultMinWidth}
      buttonPadding={label ? padding : '0'} // No padding if icon-only and centered
      activeColor={activeColor}
      textColor={textColor}
      activeTextColor={activeTextColor}
      activeBgColor={activeTabBackgroundColor}
      inactiveBgColor={inactiveTabBackgroundColor}
      onClick={onClick}
      disabled={disabled}
      className={`${className || ''} ${isActive ? 'isActive' : ''}`}
      hasLabel={!!label}
      hasIcon={!!iconSrc}
      {...rest}
    >
      {iconSrc && (
        <Icon
          iconSrc={iconSrc}
          shape="square" // Or 'circle' if preferred
          size={`calc(${height} * 0.55)`}
          backgroundColor="transparent"
          borderColor="transparent"
          className="tab-icon-element" // Added class for specific styling if needed
        />
      )}
      {label && <span>{label}</span>}
    </StyledTabButton>
  );
};