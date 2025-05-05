import React from "react";
import { PanelActionImplementation } from "../../../game/display/game/tools/selection/SelectionPanelModule.ts";
import "./ActionButton.css";
import { useSelectedTool } from "./useSelectedTool.ts";

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
