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

export class MapEditorModule extends DisplayModule<EditorContext> {
    public display!: GameDisplay;
    public state!: MapEditorState;

    private modules: DisplayModule<MapEditorModule>[] = [
        new MapEditorCameraModule(),
        new MapViewRenderer(),
        new MapTools(),
        new MapEditorToolPreviewModule(),
        new MapEditorHistoryModule()
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
        clearViews();
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
