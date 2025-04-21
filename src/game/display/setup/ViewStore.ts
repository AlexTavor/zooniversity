import {DisplayTraitType, PanelDefinition, ViewDefinition, ViewType} from "./ViewDefinition.ts";

export type ViewMap = Record<number, ViewDefinition>;

let nextId = 1;
let viewMap: ViewMap = {};

const panelDefinitions: Record<ViewType, PanelDefinition> = {
    [ViewType.TREE]: {
        title: "Tree",
        description: "A lush forest tree. May sway in the wind.",
        imagePath: "assets/panels/tree_panel.png",
        traits: [
            { type: DisplayTraitType.WOOD, value: 10 },
            { type: DisplayTraitType.FOOD, value: 5 },
        ],
    },
    [ViewType.CAVE]: {
        title: "Cave",
        description: "A dark cave entrance. Mysterious and unexplored.",
        imagePath: "assets/panels/cave_panel.png",
    },
    [ViewType.NONE]: {
        title: "",
        description: "",
        imagePath: "",
    }
};

export function createView(def: Partial<ViewDefinition>): ViewDefinition {
    const id = nextId++;
    const type = def.type ?? ViewType.NONE;

    const view: ViewDefinition = {
        id,
        spriteName: def.spriteName ?? ``,
        position: def.position ?? { x: 0, y: 0 },
        size: def.size ?? { x: 1, y: 1 },
        frame: def.frame ?? 0,
        subViews: [],
        type,
        selectable: def.selectable !== false,
        panelDefinition: def.panelDefinition ?? panelDefinitions[type],
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
