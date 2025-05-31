import { Component } from "../../ECS";

export enum NeedType {
    SLEEP = "Sleep",
    FOOD = "Hunger"
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

    public updateNeedCurrent(type: NeedType, amount: number, delta:boolean = false): void {
        const need = this.needs.get(type);
        if (need) {
            if (delta){
                need.current = Math.max(0, Math.min(need.current + amount, need.max));
            } else {
                need.current = Math.max(0, Math.min(amount, need.max));
            }
        }
    }

    public setNeed(type: NeedType, current: number, max: number): void {
        this.needs.set(type, { current, max });
    }
}