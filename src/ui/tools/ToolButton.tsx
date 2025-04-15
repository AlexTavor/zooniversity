//@ts-ignore
import React from 'react';
import {EditorTool, TOOL_SELECTED_EVENT} from "../../game/display/editor/EditorHost.ts";
import {EventBus} from "../../game/EventBus.ts";

const labels: Record<EditorTool, string> = {
    map: '🗺️',
    views: '📦',
    // Add more here later if needed
};

export function ToolButton({ tool, current }: { tool: EditorTool; current: EditorTool }) {
    const isActive = tool === current;

    const handleClick = () => {
        if (!isActive) {
            localStorage.setItem('editor-tool', tool);
            EventBus.emit(TOOL_SELECTED_EVENT, tool);
        }
    };

    return (
        <button
            className={`tool-button ${isActive ? 'active' : ''}`}
            onClick={handleClick}
            title={tool}
        >
            {labels[tool]}
        </button>
    );
}
