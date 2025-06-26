import { EventBus } from "../../EventBus";
import { GameEvent } from "../../consts/GameEvent";
import { UIEvent } from "../../consts/UIEvent";
import { View } from "../setup/View";
import { PanelDefinition } from "../setup/ViewDefinition";
import { ToolType } from "../tools/GameTools";

export type PanelActionImplementation = {
    label: string;
    type: string;
    action: () => void;
    icon?: string;
};

type PanelActionMaker = (
    def: PanelDefinition,
    entity: number,
    view: View,
) => () => void;

const actionFunctions: Record<string, PanelActionMaker> = {
    tree_cutting: (_def, _entity, _view) => () => {
        EventBus.emit(GameEvent.ToolSelected, ToolType.TreeCutting);
    },
    find: (_def, _entity, view) => () => {
        EventBus.emit(UIEvent.FindViewRequested, view.viewContainer);
    },
};

const actionIcons: Record<string, string> = {
    tree_cutting: "assets/icons/axe_icon.png",
    find: "assets/icons/find_icon.png",
};

export function createPanelActions(
    def: PanelDefinition,
    entity: number,
    view: View,
): PanelActionImplementation[] {
    if (!def.actions) return [];
    return def.actions.map((action) => ({
        label: action.label,
        type: action.type,
        action: actionFunctions[action.type]?.(def, entity, view) ?? (() => {}),
        icon: actionIcons[action.type] ?? undefined,
    }));
}
