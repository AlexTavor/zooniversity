import { EventBus } from "../../EventBus";
import { GameDisplayContext } from "../GameDisplay";
import { GameEvent } from "../../consts/GameEvent";
import { UIEvent } from "../../consts/UIEvent";
import { DisplayModule } from "../setup/DisplayModule";
import {
    PanelActionImplementation,
    createPanelActions,
} from "../data_panel/PanelAction";
import { PanelTypeReducers } from "../data_panel/PanelReducersRegistry";
import { PanelDefinition } from "../setup/ViewDefinition";

const findActionDefinition = {
    label: "find",
    type: "find",
};

export type PanelData = {
    id: number;
    findAction?: () => void;
    actionsImpl?: PanelActionImplementation[];
    panelTypeData?: any;
} & PanelDefinition;

export class PanelApi extends DisplayModule<GameDisplayContext> {
    private context!: GameDisplayContext;
    private selected: number = -1;
    private lastPushedPayload: string = "";

    public init(context: GameDisplayContext): void {
        this.context = context;
        EventBus.on(
            GameEvent.FetchPanelDataRequested,
            this.handleFetchRequest,
            this,
        );
        // Listen for selection changes to know which entity to track for push updates.
        EventBus.on(
            GameEvent.SelectionChanged,
            this.handleSelectionChanged,
            this,
        );
    }

    public destroy(): void {
        EventBus.off(
            GameEvent.FetchPanelDataRequested,
            this.handleFetchRequest,
            this,
        );
        EventBus.off(
            GameEvent.SelectionChanged,
            this.handleSelectionChanged,
            this,
        );
    }

    /**
     * Pushes panel data updates for the selected entity, but only if the
     * data has actually changed since the last push.
     */
    public update(_delta: number): void {
        if (this.selected === -1) {
            return;
        }

        const panelData = this.buildData(this.selected);
        if (!panelData) return;

        const currentPayload = JSON.stringify(panelData);

        // Only emit an update event if the data has changed.
        if (currentPayload !== this.lastPushedPayload) {
            this.lastPushedPayload = currentPayload;
            EventBus.emit(GameEvent.PanelDataUpdated, {
                panelData: panelData,
            });
        }
    }

    /**
     * Sets the currently selected entity and resets the payload cache,
     * ensuring the next update() push is fresh.
     * @param entityId The newly selected entity's ID.
     */
    private handleSelectionChanged(entityId: number): void {
        this.selected = entityId;
        this.lastPushedPayload = ""; // Reset cache on new selection
    }

    /**
     * Handles a direct request for panel data from the UI (the "pull" mechanism).
     */
    public handleFetchRequest({
        entityId,
        requestId,
    }: {
        entityId: number;
        requestId: number;
    }): void {
        const panelData = this.buildData(entityId);

        // Cache the newly fetched data payload to prevent an immediate redundant push update.
        this.lastPushedPayload = panelData ? JSON.stringify(panelData) : "";

        EventBus.emit(GameEvent.FetchPanelDataSucceeded, {
            requestId,
            panelData,
        });
    }

    private buildData(entityId: number): PanelData | undefined {
        const view = this.context.viewsByEntity.get(entityId);
        if (!view) return;

        const baseDef = view.viewDefinition.panelDefinition;
        if (!baseDef) return;

        const panelTypeData = baseDef.panelType
            ? PanelTypeReducers[baseDef.panelType]?.(entityId, this.context.ecs)
            : undefined;

        const fullDef: PanelData = {
            ...baseDef,
            actionsImpl: createPanelActions(
                {
                    ...baseDef,
                    actions: [findActionDefinition, ...(baseDef.actions || [])],
                },
                entityId,
                view,
            ),
            panelTypeData,
            findAction: () => {
                EventBus.emit(UIEvent.FindViewRequested, view.viewContainer);
            },
            title:
                (panelTypeData as any)?.displayName ??
                view.viewDefinition.spriteName,
            id: entityId,
        };

        return fullDef;
    }
}
