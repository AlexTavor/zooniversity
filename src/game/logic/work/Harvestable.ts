import { Component } from "../../ECS";

export enum HarvestableType {
    NONE = 0,
    TREE = 1
}

export class Harvestable extends Component {
    public amount: number = 0;
    public maxAmount: number = 0;
    public harvestable: boolean = true;
    public harvested: boolean = false;
    public type: HarvestableType;
    
    constructor(type:HarvestableType, amount: number, maxAmount: number | null = null) {
        super();
        this.type = type;
        this.amount = amount;
        this.maxAmount = maxAmount == null ? amount : maxAmount;
    }
}