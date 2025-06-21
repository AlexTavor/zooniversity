import { ECS, Entity } from "../../ECS";
import { PanelType } from "../setup/ViewDefinition";
import { cavePanelReducer } from "./buildings/cavePanelReducer";
import { characterPanelReducer } from "./character/characterPanelReducer";
import { treePanelReducer } from "./tree/treePanelReducer";
import { woodDojoPanelReducer } from "./buildings/woodDojoPanelReducer";

export type PanelTypeReducer = (entity: Entity, ecs: ECS) => unknown;

export const PanelTypeReducers: Partial<Record<PanelType, PanelTypeReducer>> = {
    [PanelType.CHARACTER]: characterPanelReducer,
    [PanelType.WOOD_DOJO]: woodDojoPanelReducer,
    [PanelType.CAVE]: cavePanelReducer,
    [PanelType.TREE]: treePanelReducer,
};
