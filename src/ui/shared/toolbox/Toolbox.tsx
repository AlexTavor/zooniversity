import React, { useState, useEffect } from 'react';
import './Toolbox.css';
import { getSelectedTool, setSelectedTool, ToolType } from '../../../game/display/editor/common/ToolboxState';

export interface ToolboxOption {
    icon: string;
    label: string;
    value: ToolType;
}

interface ToolboxProps {
    toolOptions: ToolboxOption[];
}

export const Toolbox: React.FC<ToolboxProps> = ({ toolOptions }) => {
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
            {toolOptions.map((tool) => (
                <button
                    key={tool.value}
                    className={`sidebar-button ${selectedTool === tool.value ? 'active' : ''}`}
                    onClick={() => handleSelect(tool.value)}
                >
                    <span className="sidebar-icon">{tool.icon}</span>
                    <span className="sidebar-label">{tool.label}</span>
                </button>
            ))}
        </div>
    );
};
