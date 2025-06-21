import { GameDisplayContext } from "../GameDisplay.ts";
import { DisplayModule } from "../setup/DisplayModule.ts";
import { EventBus } from "../../EventBus.ts";
import { UIEvent } from "../../consts/UIEvent.ts";
import { GameEvent } from "../../consts/GameEvent.ts";
import { PanelDefinition } from "../setup/ViewDefinition.ts";
import { PanelTypeReducer, PanelTypeReducers } from "./PanelReducersRegistry.ts";
import { PanelActionImplementation, SelectionPanelReducer, SelectionPanelReducers, createPanelActions } from "./PanelAction.ts";

export type PanelData = {
  findAction?:()=>void;
  actionsImpl?: PanelActionImplementation[];
  panelTypeData?: unknown;
} & PanelDefinition;

const findActionDefinition = {
  label: "find",
  type: "find",
};

export class DataPanelModule extends DisplayModule<GameDisplayContext> {
  private display: GameDisplayContext;
  private activeEntity: number = -1;
  private lastPayload: string = "";

  public init(display: GameDisplayContext): void {
    this.display = display;
    EventBus.on(GameEvent.SelectionChanged, this.handleSelectionChanged, this);
  }

  public destroy(): void {
    EventBus.off(GameEvent.SelectionChanged, this.handleSelectionChanged, this);
  }

  private handleSelectionChanged(entity: number): void {
    this.activeEntity = entity;
    this.updatePanel();
  }

  public update(_: number): void {
    this.updatePanel();
  }

  private updatePanel(): void {
    if (this.activeEntity === -1) {
        EventBus.emit(UIEvent.ShowPanelCalled, null);
        this.lastPayload = "";
        return;
    }

    const view = this.display.viewsByEntity.get(this.activeEntity);
    if (!view) return;

    const baseDef = view.viewDefinition.panelDefinition;
    if (!baseDef) return;

    const reducer: SelectionPanelReducer | undefined = SelectionPanelReducers[view.viewDefinition.type];
    const reduced = reducer ? reducer(this.activeEntity, this.display.ecs) : {};

    const typeReducer: PanelTypeReducer | undefined = baseDef.panelType ? PanelTypeReducers[baseDef.panelType] : undefined;
    const panelTypeData = typeReducer ? typeReducer(this.activeEntity, this.display.ecs) : undefined;
    const fullDef: PanelData = {
            ...baseDef,
            ...reduced,
            actionsImpl: createPanelActions({...baseDef, actions:[findActionDefinition, ...(baseDef.actions || [])]}, this.activeEntity, view),
            panelTypeData,
            findAction:()=>{EventBus.emit(UIEvent.FindViewRequested, view.viewContainer);},
            title: (panelTypeData as any).displayName ?? view.viewDefinition.spriteName,
        };

        const payload = JSON.stringify(fullDef);
        if (payload !== this.lastPayload) {
            this.lastPayload = payload;
            EventBus.emit(UIEvent.ShowPanelCalled, fullDef);
        }
    }
}
