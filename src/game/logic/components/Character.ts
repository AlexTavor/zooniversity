import { Component } from "../../ECS";

export enum CharacterType {
    PROFESSOR = "PROFESSOR"
}

export class CharacterDefinition {
    public name: string;
    public description: string;
    public type:CharacterType;
}

export class Character extends Component {
    constructor(
        public definition: CharacterDefinition,
    ) {
        super();
    }
}