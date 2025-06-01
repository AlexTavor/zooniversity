// src/game/logic/foraging/ForagableComponent.ts
import { Component } from "../../ECS"; // Adjust path as needed
import { ResourceType } from "../resources/ResourceType"; // Adjust path as needed

export class ForagableComponent extends Component {
  public resourceType: ResourceType;
  public currentAmount: number;
  public maxAmount: number;
  public regenRatePerMinute: number; // Units regenerated per game minute for the node
  public yieldPerMinute: number;     // Base units a character can extract per minute of foraging at this node

  constructor(
    resourceType: ResourceType,
    initialAmount: number,
    maxAmount: number,
    regenRatePerMinute: number,
    yieldPerMinute: number = 1 // Default base yield of 1 unit per minute of foraging
  ) {
    super();
    this.resourceType = resourceType;
    this.currentAmount = initialAmount;
    this.maxAmount = maxAmount;
    this.regenRatePerMinute = regenRatePerMinute;
    this.yieldPerMinute = yieldPerMinute;
  }

  public isDepleted(): boolean {
    return this.currentAmount <= 0;
  }
}