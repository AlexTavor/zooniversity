import { Pos } from "../../../utils/Math.ts";
import { Config } from "../../config/Config.ts";

export const TreeSpriteKeys = [
    "tree0",
    "tree1",
    "tree2",
    "tree3",
    "tree4",
    "tree5",
] as const;
export const PlantSpriteKeys = [...TreeSpriteKeys, "bush0", "bush1"] as const;
export type PlantSpriteKey = (typeof PlantSpriteKeys)[number];
export type TreeSpriteKey = (typeof TreeSpriteKeys)[number];
export type HillSpriteKey = "hill";
export const CaveSpriteKeys = ["cave", "wood_dojo"] as const;
export type CaveSpriteKey = (typeof CaveSpriteKeys)[number];
export const CharacterKeys = ["booker_char"] as const;
export type CharacterKey = (typeof CharacterKeys)[number];
export type SpriteKey =
    | PlantSpriteKey
    | HillSpriteKey
    | CaveSpriteKey
    | CharacterKey;

export const TreeAtlasKeys = [
    "fir0",
    "fir1",
    "linden0",
    "linden1",
    "beech0",
    "beech1",
    "oak0",
    "oak1",
    "rowan0",
    "rowan1",
    "birch0",
    "birch1",
    "cedar0",
    "cedar1",
    "maple0",
    "maple1",
] as const;
export type TreeAtlasKey = (typeof TreeAtlasKeys)[number];

export type TreeSpriteAtlasMap = {
    [key in TreeSpriteKey]: [TreeAtlasKey, TreeAtlasKey];
};

export const treeSpriteToAtlasMap: TreeSpriteAtlasMap = {
    tree0: [TreeAtlasKeys[0], TreeAtlasKeys[1]], // fir0, fir1
    // tree1: [TreeAtlasKeys[2], TreeAtlasKeys[3]],   // linden0, linden1
    tree2: [TreeAtlasKeys[4], TreeAtlasKeys[5]], // beech0, beech1
    tree3: [TreeAtlasKeys[6], TreeAtlasKeys[7]], // oak0, oak1
    tree4: [TreeAtlasKeys[8], TreeAtlasKeys[9]], // rowan0, rowan1
    tree5: [TreeAtlasKeys[10], TreeAtlasKeys[11]], // birch0, birch1
    //tree1: [TreeAtlasKeys[12], TreeAtlasKeys[13]], // cedar0, cedar1
    tree1: [TreeAtlasKeys[14], TreeAtlasKeys[15]], // maple0, maple1
};

export const plantSpriteToNameAndDescription = {
    tree0: {
        name: "Fir Tree",
        description:
            "A tall, evergreen fir tree with dense, dark green needles.",
    },
    tree1: {
        name: "Maple Tree",
        description:
            "A broadleaf maple tree with a bifurcated trunk and vibrant green leaves.",
    },
    tree2: {
        name: "Beech Tree",
        description:
            "A stately beech tree with smooth bark and a full leafy canopy.",
    },
    tree3: {
        name: "Oak Tree",
        description:
            "An ancient oak tree with a sturdy trunk and sprawling branches.",
    },
    tree4: {
        name: "Rowan Tree",
        description: "A slender rowan tree with delicate compound leaves.",
    },
    tree5: {
        name: "Birch Tree",
        description:
            "A graceful birch tree with white bark and light, airy foliage.",
    },
    bush1: {
        name: "Natal Plum Bush",
        description: "Beauty and bountiful foraging in one lovely shrub",
    },
    bush0: {
        name: "Blueberry Bush",
        description: "Lovely shrubberry, much fruit!.",
    },
} as const;

interface SpriteDefinition {
    key: SpriteKey;
    defaultSize: Pos;
    path?: string;
    atlas?: string;
}

const defaultTreeSize = { x: 2, y: 2 };
const defaultBushSize = { x: 1, y: 1 };
const defaultCaveSize = { x: 1.25, y: 1.25 };
const defaultCharSize = { x: 0.5, y: 0.5 };
const defaultHillSize = {
    x: 1 + Config.GameWidth / Config.Display.PixelsPerUnit,
    y: Config.GameHeight / Config.Display.PixelsPerUnit,
};

export const SpriteLibrary: Record<SpriteKey, SpriteDefinition> = {
    tree0: {
        key: "tree0",
        defaultSize: defaultTreeSize,
        path: "assets/plants/tree0.png",
    },
    tree1: {
        key: "tree1",
        defaultSize: defaultTreeSize,
        path: "assets/plants/tree1.png",
    },
    tree2: {
        key: "tree2",
        defaultSize: defaultTreeSize,
        path: "assets/plants/tree2.png",
    },
    tree3: {
        key: "tree3",
        defaultSize: defaultTreeSize,
        path: "assets/plants/tree3.png",
    },
    tree4: {
        key: "tree4",
        defaultSize: defaultTreeSize,
        path: "assets/plants/tree4.png",
    },
    tree5: {
        key: "tree5",
        defaultSize: defaultTreeSize,
        path: "assets/plants/tree5.png",
    },
    bush0: {
        key: "bush0",
        defaultSize: defaultBushSize,
        path: "assets/plants/bush0.png",
    },
    bush1: {
        key: "bush1",
        defaultSize: defaultBushSize,
        path: "assets/plants/bush1.png",
    },
    hill: {
        key: "hill",
        defaultSize: defaultHillSize,
        path: "assets/hill/hill.png",
    },
    cave: {
        key: "cave",
        defaultSize: defaultCaveSize,
        path: "assets/hill/cave.png",
    },
    wood_dojo: {
        key: "wood_dojo",
        defaultSize: defaultCaveSize,
        path: "assets/hill/wood_dojo.png",
    },
    booker_char: {
        key: "booker_char",
        defaultSize: defaultCharSize,
    },
};
