export type ToolType = 'none' | 'paint' | 'erase' | 'move' | 'resize' | 'drop';

let selectedTool: ToolType = 'none';

export const getSelectedTool = () => selectedTool;
export const setSelectedTool = (tool: ToolType) => { selectedTool = tool; };
