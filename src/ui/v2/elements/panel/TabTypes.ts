import { PanelType } from "../../../../game/display/setup/ViewDefinition";

export interface TabDefinition {
    id: string; 
    label?: string;
    iconSrc?: string;
  }

  export const TABS_CONFIG: Partial<Record<PanelType, TabDefinition[]>> = {
    [PanelType.CHARACTER]: [
      { id: 'info', label: 'Info'},
      { id: 'thoughts', label: 'Thoughts'},
    ],
    [PanelType.WOOD_DOJO]: [
      { id: 'dojo_overview', label: 'Details' }
    ],
    [PanelType.TREE]: [
      { id: 'info', label: 'Details' },
    ],
    [PanelType.CAVE]: [
      { id: 'cave_details', label: 'Details' },
    ]
  };