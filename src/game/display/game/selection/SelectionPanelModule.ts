import {GameDisplayContext} from "../../GameDisplay.ts";
import {DisplayModule} from "../../setup/DisplayModule.ts";
import {EventBus} from "../../../EventBus.ts";
import {GameEvent} from "../../../consts/GameEvent.ts";
import {UIEvent} from "../../../consts/UIEvent.ts";

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
            EventBus.emit(UIEvent.ShowPanel, null);
            return;
        }
        
        const view = this.display.viewsByEntity.get(entity);
        if (!view) return;
        
        const d = view.viewDefinition.panelDefinition;
        const obj = d ? {...d, title: `${d.title} #${entity}`} : null;
        EventBus.emit(UIEvent.ShowPanel, obj);
    }

    public update(_: number): void {
        // Update logic for the selection panel
    }
}