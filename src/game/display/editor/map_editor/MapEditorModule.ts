import { DisplayModule } from '../../setup/DisplayModule';
import { GameDisplay } from '../../GameDisplay';
import { MapEditorState } from './MapEditorState';
import {MapViewRenderer} from "./modules/renderer/MapViewRenderer.ts";
import {MapTools} from "./modules/tools/MapTools.ts";
import {MapEditorCameraModule} from "./modules/camera/MapEditorCamera.ts";
import {EditorContext} from "../EditorHost.ts";

export class MapEditorModule extends DisplayModule<EditorContext> {
    public display!: GameDisplay;
    public state!: MapEditorState;

    private modules: DisplayModule<MapEditorModule>[] = [
        new MapEditorCameraModule(),
        new MapViewRenderer(),
        new MapTools()
    ];

    public init(display: GameDisplay): void {
        this.display = display;
        this.state = new MapEditorState();
        this.modules.forEach(m => m.init(this));
        this.state.createNew();
    }

    public update(delta: number): void {
        this.modules.forEach(m => m.update(delta));
    }

    public destroy(): void {
        this.modules.forEach(m => m.destroy());
    }
}
