import { Component } from "../../ECS";

export enum NeedType {
    SLEEP = "Sleep",
    FOOD = "Food"
}

export interface NeedData {
    current:number,
    max:number
}

export class NeedsComponent extends Component {
    public needs: Map<NeedType, NeedData>;

    constructor(initialNeeds?: Map<NeedType, NeedData>) {
        super();
        this.needs = initialNeeds || new Map<NeedType, NeedData>();
    }

    public need(type: NeedType): NeedData | undefined {
        return this.needs.get(type);
    }

    public updateNeedCurrent(type: NeedType, amount: number): void {
        const need = this.needs.get(type);
        if (need) {
            need.current = Math.max(0, Math.min(amount, need.max));
        }
    }

    public setNeed(type: NeedType, current: number, max: number): void {
        this.needs.set(type, { current, max });
    }
}