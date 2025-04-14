import React, { useState, useEffect } from 'react';
import './Toolbox.css';
import {getSelectedTool, setSelectedTool, ToolType} from "../../../game/display/setup/ToolboxState.ts";

const TOOL_OPTIONS: { icon: string; label: string; value: ToolType }[] = [
    { icon: '🎨', label: 'Paint', value: 'paint' },
    { icon: '🎯', label: 'Drop', value: 'drop' },
    { icon: '🧽', label: 'Erase', value: 'erase' },
    { icon: '✋', label: 'Move', value: 'move' },
    { icon: '📏', label: 'Resize', value: 'resize' }
];

export const Toolbox: React.FC = () => {
    const [selectedTool, setLocalTool] = useState<ToolType>(getSelectedTool());

    const handleSelect = (tool: ToolType) => {
        setLocalTool(tool);
        setSelectedTool(tool);
    };

    useEffect(() => {
        setLocalTool(getSelectedTool());
    }, []);

    return (
        <div className="toolbox">
            {TOOL_OPTIONS.map(tool => (
                <button
                    key={tool.value}
                    className={`tool-button ${selectedTool === tool.value ? 'active' : ''}`}
                    onClick={() => handleSelect(tool.value)}
                >
                    <span className="icon">{tool.icon}</span>
                    <span className="label">{tool.label}</span>
                </button>
            ))}
        </div>
    );
};
