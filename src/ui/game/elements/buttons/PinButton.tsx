// PinButton.tsx
import React from "react";
import styled from "@emotion/styled";

export enum PinIconType {
    LOOKING_GLASS = "LOOKING_GLASS",
    CHEVRON = "CHEVRON",
}

export type ChevronDirection = "up" | "down" | "left" | "right";

const pinIconMap: Record<PinIconType, string> = {
    [PinIconType.CHEVRON]: "assets/pins/chevron.png",
    [PinIconType.LOOKING_GLASS]: "assets/pins/looking_glass.png",
};

interface PinButtonProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
    iconType: PinIconType;
    title: string;
    onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
    direction?: ChevronDirection;
    size?: string;
}

const getRotationForDirection = (direction?: ChevronDirection): number => {
    switch (direction) {
        case "up":
            return 0;
        case "down":
            return 180;
        case "left":
            return -90;
        case "right":
            return 90;
        default:
            return 0; // Default to 'up' if undefined or for non-chevron
    }
};

const StyledPinButton = styled.div<{
    buttonSize: string;
}>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${(props) => props.buttonSize};
    height: ${(props) => props.buttonSize};
    padding: 0;
    border-radius: 50%;
    cursor: pointer;
`;

const IconImage = styled.img<{ rotation: number }>`
    width: 100%;
    height: 100%;
    object-fit: contain;
    transform: rotate(${(props) => props.rotation}deg);
    transition: transform 0.25s ease-in-out; /* Animation for rotation */
`;

export const PinButton: React.FC<PinButtonProps> = ({
    iconType,
    title,
    onClick,
    direction = "up",
    size = "24px",
    disabled,
    className,
    ...rest
}) => {
    const iconSrc = pinIconMap[iconType];

    if (!iconSrc) {
        console.warn(`PinButton: Icon for type "${iconType}" not found.`);
        return null;
    }

    const rotation =
        iconType === PinIconType.CHEVRON
            ? getRotationForDirection(direction)
            : 0;

    return (
        <StyledPinButton
            type="button"
            title={title}
            aria-label={title}
            buttonSize={size}
            onClick={onClick}
            className={className}
            {...rest}
        >
            <IconImage src={iconSrc} alt="" rotation={rotation} />
        </StyledPinButton>
    );
};
