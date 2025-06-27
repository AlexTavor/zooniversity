import React from "react";
import styled from "@emotion/styled";

interface MenuButtonProps {
    title: string;
    onClick: () => void;
    enabled?: boolean;
}

const StyledMenuButton = styled.button`
    font-family: 'Chewy', cursive;
    font-size: 1.6rem;
    padding: 24px 56px;
    background-color: #fce8c6; /* soft parchment tone */
    border: 3px solid #6b4c3b; /* rich brown */
    border-radius: 12px;
    color: #2f1f16; /* darker brown text */
    cursor: pointer;
    transition:
        transform 0.2s ease-out,
        box-shadow 0.2s ease-out,
        background-color 0.2s ease-in;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    &:hover:not(:disabled) {
        transform: translateY(-4px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    &:active:not(:disabled) {
        transform: scale(0.96);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
    }
`;

export const MenuButton: React.FC<MenuButtonProps> = ({
    title,
    onClick,
    enabled = true,
}) => {
    return (
        <StyledMenuButton
            onClick={enabled ? onClick : undefined}
            disabled={!enabled}
        >
            {title}
        </StyledMenuButton>
    );
};