import React from "react";

interface MenuButtonProps {
    title: string;
    onClick: () => void;
    enabled?: boolean;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ title, onClick, enabled = true }) => {
    return (
        <button
            className={`menu-button${enabled ? "" : " disabled"}`}
            onClick={enabled ? onClick : undefined}
            disabled={!enabled}>
            {title}
            </button>
        );
};
