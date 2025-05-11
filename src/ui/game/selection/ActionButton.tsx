import React from "react";
import { useSelectedTool } from "./useSelectedTool.ts";
import { PanelActionImplementation } from "../../../game/display/game/data_panel/PanelAction.ts";

interface ActionButtonProps {
    action: PanelActionImplementation;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ action }) => {
    const selectedTool = useSelectedTool();
    const isActive = action.type === selectedTool;

    return (
        <button
            className={`action-button ${isActive ? "active" : ""}`}
            style={{
                backgroundImage: action.icon ? `url(${action.icon})` : undefined,
            }}
            onClick={action.action}
        />
    );
};
