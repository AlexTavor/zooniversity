import {GameDisplayContext} from "../../../GameDisplay.ts";
import {DisplayModule} from "../../../setup/DisplayModule.ts";
import {EventBus} from "../../../../EventBus.ts";
import {UIEvent} from "../../../../consts/UIEvent.ts";
import { GameEvent } from "../../../../consts/GameEvent.ts";
import { PanelDefinition } from "../../../setup/ViewDefinition.ts";
import { ToolType } from "../GameTools.ts";

export class SelectionPanelModule extends DisplayModule<GameDisplayContext> {
    private display: GameDisplayContext;
    public init(display: GameDisplayContext): void {
        this.display = display;
        
        EventBus.on(GameEvent.SelectionChanged, this.handleSelectionChanged, this);
    }

    destroy(): void {
        EventBus.off(GameEvent.SelectionChanged, this.handleSelectionChanged, this);
    }

    private handleSelectionChanged(entity: number): void {
        if (entity == -1) {
            EventBus.emit(UIEvent.ShowPanelCalled, null);
            return;
        }
        
        const view = this.display.viewsByEntity.get(entity);
        if (!view) return;
        
        const d = view.viewDefinition.panelDefinition;
        const obj = d ? {...d, title: `${d.title}`, actionsImpl:this.createPanelActions(d)} : null;
        EventBus.emit(UIEvent.ShowPanelCalled, obj);
    }

    public update(_: number): void {
        // Update logic for the selection panel
    }

    private createPanelActions(def:PanelDefinition): PanelActionImplementation[] {
        if (!def.actions) return [];

        return def.actions.map(action => ({
            label: action.label,
            type: action.type,
            action: actionFunctions[action.type] || (() => {}),
            icon: actionIcons[action.type] || undefined
        }));
    }
}

const actionFunctions: Record<string, () => void> = {
    "tree_cutting": () => {
        EventBus.emit(GameEvent.ToolSelected, ToolType.TreeCutting);
    }
}

const actionIcons: Record<string, string> = {
    "tree_cutting": "assets/icons/axe_icon.png"
}

export type PanelActionImplementation = {
    label: string;
    type: string;
    action: () => void;
    icon?: string;
}
