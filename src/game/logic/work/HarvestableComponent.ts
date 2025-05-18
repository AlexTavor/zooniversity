import { Component } from "../../ECS";
import { ResourceType } from "../resources/ResourceType";

export type ResourceDrop = {
    type:ResourceType,
    amount:number
}

export class HarvestableComponent extends Component {
    public maxAmount: number = 0;
    public harvestable: boolean = true;
    public harvested: boolean = false;
    
    constructor(public amount: number, public drops: ResourceDrop[]) {
        super();
        this.amount = amount;
        this.maxAmount = amount;
    }
}