// PinButton.tsx
import React from 'react';
import styled from '@emotion/styled';

export enum PinIconType {
  LOOKING_GLASS = 'LOOKING_GLASS',
  CHEVRON = 'CHEVRON',
}

export type ChevronDirection = 'up' | 'down' | 'left' | 'right';

const pinIconMap: Record<PinIconType, string> = {
  [PinIconType.LOOKING_GLASS]: 'assets/icons/focus_pin.svg',
  [PinIconType.CHEVRON]: 'assets/icons/chevron_up_pin.svg',
};

interface PinButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  iconType: PinIconType;
  title: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  direction?: ChevronDirection; 
  size?: string;
}

const getRotationForDirection = (direction?: ChevronDirection): number => {
  switch (direction) {
    case 'up':
      return 0;
    case 'down':
      return 180;
    case 'left':
      return -90;
    case 'right':
      return 90;
    default:
      return 0; // Default to 'up' if undefined or for non-chevron
  }
};

const StyledPinButton = styled.button<{
  buttonSize: string;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.buttonSize};
  height: ${props => props.buttonSize};
  padding: 0;
  border-radius: 50%;
  cursor: pointer;
  color: #38281d; /* Icon color */

  /* Simplified Brass effect */
  background: radial-gradient(ellipse at top left, #f0e0c0 0%, #ad8a56 60%, #5a3e2b 100%);
  border: 1px solid #5a3e2b;
  box-shadow: inset 0 0 1px 1px rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.3);
  transition: transform 0.1s ease-out, box-shadow 0.1s ease-out, background 0.2s ease;

  &:hover:not(:disabled) {
    background: radial-gradient(ellipse at top left, #f0e0c0 0%, #ad8a56 50%, #6b4c3b 100%);
    box-shadow: inset 0 0 1px 1px rgba(255, 255, 255, 0.3), 0 2px 3px rgba(0, 0, 0, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(1px) scale(0.95);
    box-shadow: inset 0 0 1px 1px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    background: #7d6a5a;
    box-shadow: inset 0 0 1px 1px rgba(0, 0, 0, 0.1);
  }
`;

const IconImage = styled.img<{ rotation: number }>`
  width: 60%;
  height: 60%;
  object-fit: contain;
  filter: drop-shadow(0 0 1px rgba(0,0,0,0.5));
  transform: rotate(${props => props.rotation}deg);
  transition: transform 0.25s ease-in-out; /* Animation for rotation */
`;

export const PinButton: React.FC<PinButtonProps> = ({
  iconType,
  title,
  onClick,
  direction = 'up',
  size = '20px',
  disabled,
  className,
  ...rest
}) => {
  const iconSrc = pinIconMap[iconType];

  if (!iconSrc) {
    console.warn(`PinButton: Icon for type "${iconType}" not found.`);
    return null;
  }

  const rotation = iconType === PinIconType.CHEVRON ? getRotationForDirection(direction) : 0;

  return (
    <StyledPinButton
      type="button"
      title={title}
      aria-label={title}
      buttonSize={size}
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...rest}
    >
      <IconImage src={iconSrc} alt="" rotation={rotation} />
    </StyledPinButton>
  );
};