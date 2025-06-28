import React from "react";
import styled from "@emotion/styled";

interface MenuButtonProps {
    title: string;
    onClick: () => void;
    enabled?: boolean;
}

const StyledMenuButton = styled.button`
    font-family: 'Chewy', cursive;
    font-size: clamp(1.2rem, 2.5vw, 2.2rem);
    padding: 2vh 3.5vw;
    background-color: #fce8c6;
    border: 0.4vmin solid #6b4c3b;
    border-radius: 2vmin;
    color: #2f1f16;
    cursor: pointer;
    transition:
        transform 0.2s ease-out,
        box-shadow 0.2s ease-out,
        background-color 0.2s ease-in;
    box-shadow: 0 0.5vmin 0.8vmin rgba(0, 0, 0, 0.1);

    &:hover:not(:disabled) {
        transform: translateY(-0.6vmin);
        box-shadow: 0 0.8vmin 1.5vmin rgba(0, 0, 0, 0.15);
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