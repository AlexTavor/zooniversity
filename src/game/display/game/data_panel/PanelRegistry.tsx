import { PanelDefinition, PanelType } from "../../setup/ViewDefinition";
import { ToolType } from "../tools/GameTools";

export enum PanelId {
  CHAR_BOOKER = "char_booker",
  BUILDING_WOOD_DOJO = "building_wood_dojo",
  TREE_GENERIC = "tree_generic",
  CAVE_GENERIC = "cave_generic",
}

export const PanelRegistry: Partial<Record<PanelId, PanelDefinition>> = {};

export function loadPanelRegistry(scene: Phaser.Scene) {
    const raw = scene.cache.json.get("panelRegistry") as Record<PanelId, PanelDefinition>;
    for (const [key, value] of Object.entries(raw)) {
      PanelRegistry[key as PanelId] = {
        ...value,
        panelType: PanelType[value.panelType as keyof typeof PanelType],
        actions: value.actions?.map((a: any) => ({
          label: a.label,
          type: ToolType[a.type as keyof typeof ToolType],
        })),
      };
    }
  }