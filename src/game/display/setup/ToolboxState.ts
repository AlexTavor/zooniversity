export type ToolType = 'paint' | 'erase' | 'move' | 'resize' | 'drop';

let selectedTool: ToolType = 'paint';

export const getSelectedTool = () => selectedTool;
export const setSelectedTool = (tool: ToolType) => { selectedTool = tool; };
