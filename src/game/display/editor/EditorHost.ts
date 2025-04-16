import {DisplayModule} from "../setup/DisplayModule.ts";
import {MapEditorModule} from "./map_editor/MapEditorModule.ts";
import {EventBus} from "../../EventBus.ts";
import {ViewsEditorModule} from "./views_editor/ViewsEditorModule.ts";


export type EditorTool = 'map' | 'views'; // Add 'dialogue' etc. later

export const TOOL_SELECTED_EVENT = 'tool-selected';
const TOOL_STORAGE_KEY = 'editor-tool';

export interface EditorContext {
    scene: Phaser.Scene;
    layers: any; // Replace with actual type
}

export class EditorHost {
    private context!: EditorContext;
    private activeModule: DisplayModule<EditorContext> | null = null;
    private activeTool: EditorTool | null = null;

    public init(context: EditorContext): void {
        this.context = context;
        const storedTool = localStorage.getItem(TOOL_STORAGE_KEY) as EditorTool | null;
        const initialTool = storedTool ?? 'map';
        this.switchTool(initialTool);

        EventBus.on(TOOL_SELECTED_EVENT, (tool: EditorTool)=>this.switchTool(tool));
    }

    public switchTool(tool: EditorTool): void {
        if (this.activeTool === tool) return;

        this.activeModule?.destroy();
        this.activeTool = tool;

        switch (tool) {
            case 'map':
                this.activeModule = new MapEditorModule();
                break;
            case 'views':
                this.activeModule = new ViewsEditorModule();
                break;
        }

        this.activeModule?.init(this.context);
    }

    public update(delta: number): void {
        this.activeModule?.update(delta);
    }

    public destroy(): void {
        this.activeModule?.destroy();
        this.activeTool = null;
        this.activeModule = null;
        EventBus.off(TOOL_SELECTED_EVENT, (tool: EditorTool)=>this.switchTool(tool));
    }
}
