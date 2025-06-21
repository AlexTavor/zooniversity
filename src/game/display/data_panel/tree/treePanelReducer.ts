// src/game/display/game/data_panel/tree/treePanelReducer.ts
import { ECS, Entity } from "../../../ECS";
import { Tree } from "../../../logic/trees/Tree";
import { HarvestableComponent, ResourceDrop } from "../../../logic/trees/HarvestableComponent";
import { ForagableComponent } from "../../../logic/foraging/ForagableComponent";
import { ResourceType } from "../../../logic/resources/ResourceType";
import { PlantSpriteKey, plantSpriteToNameAndDescription } from "../../setup/SpriteLibrary";
import { InteractionSlots, SlotType } from "../../../components/InteractionSlots";

export interface TreeHarvestableUIData {
  hitpointsCurrent: number;
  hitpointsMax: number;
  yield: ResourceDrop[];
  isSelectedForCutting: boolean;
  isBeingCut: boolean;
}

export interface TreeForagableUIData {
  resourceType: ResourceType;
  currentAmount: number;
  maxAmount: number;
  regenRatePerMinute: number;
}

export interface TreePanelUIData {
  id: Entity;
  treeType: PlantSpriteKey | string;
  displayName: string;
  description: string;
    
  harvestableInfo?: TreeHarvestableUIData;
  foragableInfo?: TreeForagableUIData;
}


export function treePanelReducer(entity: Entity, ecs: ECS): TreePanelUIData | null {
    if (!ecs.hasEntity(entity)) return null;

    const tree = ecs.getComponent(entity, Tree);
    if (!tree) {
        return null;
    }

    const displayData = plantSpriteToNameAndDescription[tree.type];
    
    const baseData: TreePanelUIData = {
        id: entity,
        treeType: tree.type,
        displayName: displayData.name,
        description: displayData.description
    };

    const harvestable = ecs.getComponent(entity, HarvestableComponent);
    if (!harvestable) {
        return baseData; // No harvestable data, return basic info
    }

    const isBeingCut = !!(ecs.getComponent(entity, InteractionSlots)?.inUse(SlotType.WORK));

    if (harvestable) {
        baseData.harvestableInfo = {
            hitpointsCurrent: Math.max(0, Math.floor(harvestable.amount)),
            hitpointsMax: harvestable.maxAmount,
            yield: harvestable.drops,
            isSelectedForCutting: tree.selectedForCutting,
            isBeingCut: isBeingCut
        };
    }

    const foragable = ecs.getComponent(entity, ForagableComponent);
    if (foragable) {
        baseData.foragableInfo = {
            resourceType: foragable.resourceType,
            currentAmount: foragable.currentAmount,
            maxAmount: foragable.maxAmount,
            regenRatePerMinute: foragable.regenRatePerMinute
        };
    }
    
    return baseData;
}