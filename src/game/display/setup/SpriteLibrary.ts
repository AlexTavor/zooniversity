import {Pos} from "../../../utils/Math.ts";
import {Config} from "../../config/Config.ts";

export const PlantSpriteKeys = ['tree0', 'tree1', 'tree2', 'tree3', 'tree4', 'tree5', 'bush0', 'bush1'] as const;
export type PlantSpriteKey = typeof PlantSpriteKeys[number];
export type HillSpriteKey = 'hill';
export const CaveSpriteKeys = ['cave'] as const;
export type CaveSpriteKey = typeof CaveSpriteKeys[number];
export type SpriteKey = PlantSpriteKey | HillSpriteKey | CaveSpriteKey;

interface SpriteDefinition {
    key: SpriteKey;
    defaultSize: Pos;
    path?: string;
}

const defaultTreeSize = {x:2, y:2};
const defaultBushSize = {x:1, y:1};
const defaultCaveSize = {x:1, y:1};
const defaultHillSize = {x:1 + Config.GameWidth/Config.Display.PixelsPerUnit, y:Config.GameHeight/Config.Display.PixelsPerUnit};

export const SpriteLibrary: Record<SpriteKey, SpriteDefinition> = {
    tree0: {key: 'tree0', defaultSize: defaultTreeSize, path: 'assets/plants/tree0.png'},
    tree1: {key: 'tree1', defaultSize: defaultTreeSize, path: 'assets/plants/tree1.png'},
    tree2: {key: 'tree2', defaultSize: defaultTreeSize, path: 'assets/plants/tree2.png'},
    tree3: {key: 'tree3', defaultSize: defaultTreeSize, path: 'assets/plants/tree3.png'},
    tree4: {key: 'tree4', defaultSize: defaultTreeSize, path: 'assets/plants/tree4.png'},
    tree5: {key: 'tree5', defaultSize: defaultTreeSize, path: 'assets/plants/tree5.png'},
    bush0: {key: 'bush0', defaultSize: defaultBushSize, path: 'assets/plants/bush0.png'},
    bush1: {key: 'bush1', defaultSize: defaultBushSize, path: 'assets/plants/bush1.png'},
    hill: {key: 'hill', defaultSize: defaultHillSize, path: 'assets/hill/hill.png'},
    cave: {key: 'cave', defaultSize: defaultCaveSize, path: 'assets/hill/cave.png'}
};