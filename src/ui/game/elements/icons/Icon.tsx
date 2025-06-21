// Icon.tsx
import React from "react";
import styled from "@emotion/styled";

interface IconProps {
    /** Source path for the icon image/SVG. */
    iconSrc: string;
    /** Shape of the icon's bounding box. */
    shape: "circle" | "square";
    /** CSS size string (e.g., '24px', '2rem'). */
    size: string;
    /** Background color of the icon. */
    backgroundColor?: string;
    /** Border color of the icon. */
    borderColor?: string;
    /** CSS border width string (e.g., '1px', '0.1rem'). */
    borderWidth?: string;
    /** Color for the foreground fill/overlay. */
    foregroundColor?: string;
    /** Percentage (0.0 to 1.0) for the foreground fill. Fill originates from the bottom. */
    foregroundFillPercent?: number;
    /** Additional CSS class name(s). */
    className?: string;
    /** Alt text for the icon image. */
    alt?: string;

    opacity?: number;
}

const IconWrapper = styled.div<{
    shape: "circle" | "square";
    size: string;
    bgColor: string;
    bColor: string;
    bWidth: string;
    opacity: number;
}>`
    opacity: ${(props) => props.opacity};
    width: ${(props) => props.size};
    height: ${(props) => props.size};
    background-color: ${(props) => props.bgColor};
    border: ${(props) => props.bWidth} solid ${(props) => props.bColor};
    border-radius: ${(props) => (props.shape === "circle" ? "50%" : "4px")};
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    flex-shrink: 0; /* Prevent shrinking in flex containers */
`;

const IconImage = styled.img`
    width: 70%; /* Default scaling, adjust as needed */
    height: 70%; /* Default scaling, adjust as needed */
    object-fit: contain;
    position: relative;
    z-index: 2; /* Ensures icon is above the fill */
`;

const ForegroundFill = styled.div<{
    fillAmount: number; // Percentage 0-100
    fillFgColor: string;
}>`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: ${(props) => props.fillAmount}%;
    background-color: ${(props) => props.fillFgColor};
    z-index: 1; /* Behind the icon image */
    transition: height 0.2s linear;
`;

export const Icon: React.FC<IconProps> = ({
    iconSrc,
    shape,
    size,
    backgroundColor = "rgba(0, 0, 0, 0.3)",
    borderColor = "rgba(255, 255, 255, 0.5)",
    borderWidth = "1px",
    foregroundColor,
    foregroundFillPercent, // Expects 0.0 to 1.0
    className,
    alt = "",
    opacity = 1,
}) => {
    const showFill =
        typeof foregroundFillPercent === "number" &&
        foregroundColor &&
        foregroundFillPercent >= 0 &&
        foregroundFillPercent <= 1;

    const fillPercentageForCSS = showFill ? foregroundFillPercent * 100 : 0;

    return (
        <IconWrapper
            shape={shape}
            size={size}
            bgColor={backgroundColor}
            bColor={borderColor}
            bWidth={borderWidth}
            className={className}
            opacity={opacity}
            title={alt}
        >
            {showFill && (
                <ForegroundFill
                    fillAmount={fillPercentageForCSS}
                    fillFgColor={foregroundColor}
                />
            )}
            <IconImage src={iconSrc} alt={alt} />
        </IconWrapper>
    );
};
