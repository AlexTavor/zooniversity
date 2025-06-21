import { Component } from "../../ECS.ts";
import {
    PlantSpriteKey,
    TreeSpriteKey,
    TreeSpriteKeys,
    treeSpriteToAtlasMap,
} from "../../display/setup/SpriteLibrary.ts";

export class Tree extends Component {
    public selectedForCutting = false;
    public atlasKey = "";

    constructor(public type: PlantSpriteKey) {
        super();

        if (!TreeSpriteKeys.includes(type as TreeSpriteKey)) {
            // It's a bush
            this.atlasKey = type;
            return;
        }

        const subType = Math.random() >= 0.5 ? 0 : 1;
        const treeTypeArray = treeSpriteToAtlasMap[type as TreeSpriteKey];
        this.atlasKey = treeTypeArray[subType];
    }
}
