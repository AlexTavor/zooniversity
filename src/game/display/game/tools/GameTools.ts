import { EventBus } from "../../../EventBus";
import { GameEvent } from "../../../consts/GameEvent";
import { UIEvent } from "../../../consts/UIEvent";
import { GameDisplayContext } from "../../GameDisplay";
import { DisplayModule } from "../../setup/DisplayModule";
import { SelectionTool } from "./selection/SelectionTool";
import { TreeCutSelectionTool } from "./trees/TreeCutSelectionTool";

export enum ToolType {
    None = "none",
    Selection = "selection",
    TreeCutting = "tree_cutting"
}

export interface ITool {
    start(): void;
    stop(): void;
    type: ToolType;
}

export type Tool = ITool & DisplayModule<GameDisplayContext>;

export class GameTools extends DisplayModule<GameDisplayContext> {
    private context!: GameDisplayContext;
    private modules: Tool[] = [new SelectionTool(), new TreeCutSelectionTool()];
    private activeTool: ToolType = ToolType.None;
    private awaitingReset: boolean = false;

    init(context: GameDisplayContext): void {
        this.context = context;
        this.modules.forEach(module => {
            module.init(context);
        });

        EventBus.on(UIEvent.ShowPanelCalled, this.handleShowPanelCalled, this);
        EventBus.on(GameEvent.ToolSelected, this.handleToolSelected, this);
        EventBus.emit(GameEvent.ToolSelected, ToolType.Selection);
    }
    handleShowPanelCalled(data: unknown): void {
        if (data == null) {
            this.awaitingReset = true;
        }
    }

    handleToolSelected(toolType: ToolType): void {
        if (this.activeTool == toolType) {
            if (this.activeTool != ToolType.Selection) {
                this.awaitingReset = true;
            }
            return;
        }

        this.activeTool = toolType;

        this.modules.forEach(module => {
            if (module.type === toolType) {
                module.start();
            } else {
                module.stop();
            }
        });
    }

    update(delta: number): void {
        if (this.awaitingReset) {
            EventBus.emit(GameEvent.ToolSelected, ToolType.Selection);
            this.awaitingReset = false;
        }
    }

    destroy(): void {
        // Clean up if necessary
        this.context = null!;
        this.modules.forEach(module => {
            module.destroy();
        });
        EventBus.off(GameEvent.ToolSelected, this.handleToolSelected, this);
        EventBus.off(UIEvent.ShowPanelCalled, this.handleShowPanelCalled, this);
    }
}