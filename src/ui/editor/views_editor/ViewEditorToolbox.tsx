//@ts-ignore
import React from 'react';
import {Toolbox, ToolboxOption} from "../../shared/toolbox/Toolbox.tsx";

const TOOL_OPTIONS: ToolboxOption[] = [
    { icon: '🎨', label: 'Paint', value: 'paint' },
    { icon: '🎯', label: 'Drop', value: 'drop' },
    { icon: '🧽', label: 'Erase', value: 'erase' },
    { icon: '✋', label: 'Move', value: 'move' },
    { icon: '📏', label: 'Resize', value: 'resize' }
];

export function ViewEditorToolbox() {
    return <Toolbox toolOptions={TOOL_OPTIONS} />;
}
