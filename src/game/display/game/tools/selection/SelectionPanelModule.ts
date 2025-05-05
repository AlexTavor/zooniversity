import {GameDisplayContext} from "../../../GameDisplay.ts";
import {DisplayModule} from "../../../setup/DisplayModule.ts";
import {EventBus} from "../../../../EventBus.ts";
import {UIEvent} from "../../../../consts/UIEvent.ts";
import { GameEvent } from "../../../../consts/GameEvent.ts";
import { PanelDefinition } from "../../../setup/ViewDefinition.ts";
import { ToolType } from "../GameTools.ts";
import { View } from "../../../setup/View.ts";

type PanelActionMaker = (def: PanelDefinition, entity: number, view: View) => ()=>void;

const actionFunctions: Record<string, PanelActionMaker> = {
    "tree_cutting": (def: PanelDefinition, entity: number, view: View) => ()=>{
        EventBus.emit(GameEvent.ToolSelected, ToolType.TreeCutting);
    },
    "find": (def: PanelDefinition, entity: number, view: View) => ()=>{
        EventBus.emit(UIEvent.FindViewRequested, view.viewContainer);
    },
}

const actionIcons: Record<string, string> = {
    "tree_cutting": "assets/icons/axe_icon.png",
    "find": "assets/icons/find_icon.png",
}

export type PanelActionImplementation = {
    label: string;
    type: string;
    action: () => void;
    icon?: string;
}


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
        const obj = d ? {...d, title: `${d.title}`, actionsImpl:this.createPanelActions({...d, actions:[{type:"find", label:"find"}, ...(d.actions||[])]}, entity, view)} : null;
        EventBus.emit(UIEvent.ShowPanelCalled, obj);
    }

    public update(_: number): void {
        // Update logic for the selection panel
    }

    private createPanelActions(def:PanelDefinition, entity:number, view:View): PanelActionImplementation[] {
        if (!def.actions) return [];

        return def.actions.map(action => ({
            label: action.label,
            type: action.type,
            action: actionFunctions[action.type]? actionFunctions[action.type](def, entity, view) : () => {},
            icon: actionIcons[action.type] || undefined
        }));
    }
}