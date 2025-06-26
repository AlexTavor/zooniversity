import { EventBus } from "../../EventBus";
import { GameEvent } from "../../consts/GameEvent";
import { GameDisplayContext } from "../GameDisplay";
import { DisplayModule } from "../setup/DisplayModule";
import { RightClickHandler } from "../utils/RightClickHandler";
import { TreeCutSelectionTool } from "./trees/TreeCutSelectionTool";

export enum ToolType {
    None = "none",
    Selection = "selection",
    TreeCutting = "tree_cutting",
}

export interface ITool {
    start(): void;
    stop(): void;
    type: ToolType;
}

export type Tool = ITool & DisplayModule<GameDisplayContext>;

export class GameTools extends DisplayModule<GameDisplayContext> {
    private modules: Tool[] = [new TreeCutSelectionTool()];
    private activeTool: ToolType = ToolType.None;
    private awaitingReset: boolean = false;
    private rClickHandler!: RightClickHandler;

    init(context: GameDisplayContext): void {
        this.modules.forEach((module) => {
            module.init(context);
        });

        EventBus.on(GameEvent.ToolSelected, this.handleToolSelected, this);
        EventBus.emit(GameEvent.ToolSelected, ToolType.Selection);

        this.rClickHandler = new RightClickHandler(
            this.handleRightClick.bind(this),
        );
        this.rClickHandler.start();
    }

    handleRightClick() {
        this.awaitingReset = true;
    }

    handleToolSelected(toolType: ToolType): void {
        if (this.activeTool == toolType) {
            if (this.activeTool != ToolType.Selection) {
                this.awaitingReset = true;
            }
            return;
        }

        this.activeTool = toolType;

        this.modules.forEach((module) => {
            if (module.type === toolType) {
                module.start();
            } else {
                module.stop();
            }
        });
    }

    update(_delta: number): void {
        if (this.awaitingReset) {
            EventBus.emit(GameEvent.ToolSelected, ToolType.Selection);
            this.awaitingReset = false;
        }
    }

    destroy(): void {
        this.modules.forEach((module) => {
            module.destroy();
        });
        EventBus.off(GameEvent.ToolSelected, this.handleToolSelected, this);
        this.rClickHandler.stop();
    }
}
