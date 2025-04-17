import {Component} from "../../ECS.ts";
import {PlantSpriteKey} from "../../display/setup/SpriteLibrary.ts";

export class Tree extends Component {
    constructor(
        public kind: PlantSpriteKey
    ) {
        super();
    }
}