import { DisplayModule } from '../../setup/DisplayModule';
import { GameDisplay } from '../../GameDisplay';
import { MapEditorState } from './MapEditorState';
import {MapViewRenderer} from "./modules/renderer/MapViewRenderer.ts";
import {MapTools} from "./modules/tools/MapTools.ts";
import {MapEditorCameraModule} from "./modules/camera/MapEditorCamera.ts";
import {EditorContext} from "../EditorHost.ts";
import {MapEditorToolPreviewModule} from "./modules/preview/MapEditorToolPreviewModule.ts";
import {clearViews} from "../../setup/ViewStore.ts";
import {View} from "../../setup/View.ts";
import {Naming} from "../../../consts/Naming.ts";
import {MapEditorHistoryModule} from "./modules/history/MapEditorHistoryModule.ts";
import {EventBus} from "../../../EventBus.ts";
import {EditorEvents, PaletteType} from "../../../consts/EditorEvents.ts";

export class MapEditorModule extends DisplayModule<EditorContext> {
    public display!: GameDisplay;
    public state!: MapEditorState;
    public activePalette: PaletteType;
    
    private modules: DisplayModule<MapEditorModule>[] = [
        new MapEditorCameraModule(),
        new MapEditorHistoryModule(),
        new MapViewRenderer(),
        new MapTools(),
        new MapEditorToolPreviewModule()
    ];

    public init(display: GameDisplay): void {
        this.display = display;
        this.state = new MapEditorState();
        this.modules.forEach(m => m.init(this));
        this.state.createNew();
        
        EventBus.on(EditorEvents.MapLoaded, this.state.loadMap.bind(this.state));
        EventBus.on(EditorEvents.PaletteTypeSelected, this.setPaletteType.bind(this));
    }

    public update(delta: number): void {
        this.modules.forEach(m => m.update(delta));
    }

    public destroy(): void {
        this.modules.forEach(m => m.destroy());
        clearViews();
        EventBus.off(EditorEvents.MapLoaded, this.state.loadMap.bind(this.state));
        EventBus.off(EditorEvents.PaletteTypeSelected, this.setPaletteType.bind(this));
    }
    
    setPaletteType(paletteType: PaletteType) {
        this.activePalette = paletteType;
    }

    findSpriteUnderPointer(pointer: Phaser.Input.Pointer): Phaser.GameObjects.Sprite | undefined {
        const hits = this.display.scene.input.hitTestPointer(pointer);

        return hits
            .reverse() // topmost first
            .find(obj =>
                obj instanceof Phaser.GameObjects.Sprite &&
                obj.name?.startsWith(Naming.SPRITE)
            ) as Phaser.GameObjects.Sprite | undefined;
    }
    
    // This will be taken over by the renderer. Gods forgive me for this abomination.
    public getViewById(_: number): View | null {
        return null;
    }
}
