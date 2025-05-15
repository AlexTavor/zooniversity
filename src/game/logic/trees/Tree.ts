import {Component} from "../../ECS.ts";
import {PlantSpriteKey} from "../../display/setup/SpriteLibrary.ts";

export class Tree extends Component {
    public selectedForCutting = false;
    public isBeingCut = false;
    
    constructor(
        public type: PlantSpriteKey
    ) {
        super();
    }
}