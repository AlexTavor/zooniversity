import {Pos} from "../../../utils/Math.ts";
import {Config} from "../../config/Config.ts";

export const PlantSpriteKeys = ['tree0', 'tree1', 'tree2', 'tree3', 'tree4', 'tree5', 'bush0', 'bush1'] as const;
export type PlantSpriteKey = typeof PlantSpriteKeys[number];
export type HillSpriteKey = 'hill';
export type SpriteKey = PlantSpriteKey | HillSpriteKey;

interface SpriteDefinition {
    key: SpriteKey;
    defaultSize: Pos;
    path?: string;
}

const defaultSize = {x:Config.AnimImports.FrameWidth/Config.Display.PixelsPerUnit, y:Config.AnimImports.FrameHeight/Config.Display.PixelsPerUnit};

export const SpriteLibrary: Record<SpriteKey, SpriteDefinition> = {
    tree0: {key: 'tree0', defaultSize: defaultSize, path: 'assets/plants/tree0.png'},
    tree1: {key: 'tree1', defaultSize: defaultSize, path: 'assets/plants/tree1.png'},
    tree2: {key: 'tree2', defaultSize: defaultSize, path: 'assets/plants/tree2.png'},
    tree3: {key: 'tree3', defaultSize: defaultSize, path: 'assets/plants/tree3.png'},
    tree4: {key: 'tree4', defaultSize: defaultSize, path: 'assets/plants/tree4.png'},
    tree5: {key: 'tree5', defaultSize: defaultSize, path: 'assets/plants/tree5.png'},
    bush0: {key: 'bush0', defaultSize: defaultSize, path: 'assets/plants/bush0.png'},
    bush1: {key: 'bush1', defaultSize: defaultSize, path: 'assets/plants/bush1.png'},
    hill: {key: 'hill', defaultSize: {x: Config.AnimImports.StaticWidth/Config.Display.PixelsPerUnit, y: Config.AnimImports.StaticHeight/Config.Display.PixelsPerUnit}, path: 'assets/hill/hill.png'},
};