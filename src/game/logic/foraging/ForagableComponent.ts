// src/game/logic/foraging/ForagableComponent.ts
import { Component } from "../../ECS"; // Adjust path as needed
import { ResourceType } from "../resources/ResourceType"; // Adjust path as needed

export class ForagableComponent extends Component {
  public resourceType: ResourceType;
  public currentAmount: number;
  public maxAmount: number;
  public regenRatePerMinute: number; // Units regenerated per game minute for the node

  constructor(
    resourceType: ResourceType,
    initialAmount: number,
    maxAmount: number,
    regenRatePerMinute: number,
  ) {
    super();
    this.resourceType = resourceType;
    this.currentAmount = initialAmount;
    this.maxAmount = maxAmount;
    this.regenRatePerMinute = regenRatePerMinute;
  }

  public isDepleted(): boolean {
    return this.currentAmount <= 0;
  }
}