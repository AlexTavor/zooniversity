import { EventBus } from "../../EventBus";
import { GameEvent } from "../../consts/GameEvents";
import { ResourceType } from "./ResourceType";

type ResourceListener = (resources: Partial<Record<ResourceType, number>>) => void;

export class ResourceTracker {
    private static resources: Record<ResourceType, number> = {
        [ResourceType.MONEY]: 0,
        [ResourceType.WOOD]: 0,
        [ResourceType.FOOD]: 0,
        [ResourceType.TOOLS]: 0
    };

    private static listeners: Set<ResourceListener> = new Set();

    static get(type: ResourceType): number {
        return this.resources[type];
    }

    static set(type: ResourceType, value: number) {
        const clamped = Math.max(0, Math.floor(value));
        if (clamped !== this.resources[type]) {
            this.resources[type] = clamped;
            this.notify([type]);
        }
    }

    static add(type: ResourceType, delta: number) {
        this.set(type, this.resources[type] + delta);
    }

    static bulkSet(values: Partial<Record<ResourceType, number>>) {
        const changed: ResourceType[] = [];
        for (const type in values) {
            const t = type as ResourceType;
            const val = Math.max(0, Math.floor(values[t]!));
            if (val !== this.resources[t]) {
                this.resources[t] = val;
                changed.push(t);
            }
        }
        if (changed.length > 0) this.notify(changed);
    }

    static subscribe(fn: ResourceListener) {
        this.listeners.add(fn);
    }

    static unsubscribe(fn: ResourceListener) {
        this.listeners.delete(fn);
    }

    private static notify(changed: ResourceType[]) {
        const changedValues: Partial<Record<ResourceType, number>> = {};
        for (const type of changed) {
            changedValues[type] = this.resources[type];
        }
        this.listeners.forEach(fn => fn(changedValues));
        EventBus.emit(GameEvent.ResourcesUpdated, changedValues);
    }
}
