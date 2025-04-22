import { Component } from "../../ECS";
import { DisplayTrait, PanelDefinition } from "../../display/setup/ViewDefinition.ts";

export class PanelDataComponent extends Component {
    public title: string;
    public description: string;
    public traits?: DisplayTrait[];
    public imagePath: string;

    constructor(definition: PanelDefinition) {
        super();
        this.title = definition.title;
        this.description = definition.description;
        this.traits = definition.traits ?? [];
        this.imagePath = definition.imagePath;
    }
}
