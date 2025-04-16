import {ViewDefinition} from "./ViewDefinition.ts";

export type ViewMap = Record<number, ViewDefinition>;

let nextId = 1;
let viewMap: ViewMap = {};

export function createView(def: Partial<ViewDefinition>): ViewDefinition {
    const id = nextId++;
    const view: ViewDefinition = {
        id,
        spriteName: def.spriteName ?? ``,
        position: def.position ?? { x: 0, y: 0 },
        size: def.size ?? { x: 1, y: 1 },
        frame: def.frame ?? 0,
        subViews: [],
        ...def,
    };

    viewMap[id] = view;
    return view;
}

export function getView(id: number): ViewDefinition | undefined {
    return viewMap[id];
}

export function getViews(): ViewMap {
    return viewMap;
}

export function clearViews() {
    viewMap = {};
    nextId = 1;
}
