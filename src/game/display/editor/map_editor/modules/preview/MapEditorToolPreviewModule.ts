import {DisplayModule} from "../../../../setup/DisplayModule.ts";
import {PointerEvents} from "../../../../../consts/PointerEvents.ts";
import {getSelectedSpriteKey} from "../../../../setup/PaletteState.ts";
import {getSelectedTool} from "../../../../setup/ToolboxState.ts";
import {MapEditorModule} from "../../MapEditorModule.ts";
import {SpriteKey, SpriteLibrary} from "../../../../setup/SpriteLibrary.ts";
import {Config} from "../../../../../config/Config.ts";

export class MapEditorToolPreviewModule extends DisplayModule<MapEditorModule> {
    private editor!: MapEditorModule;
    private previewSprite?: Phaser.GameObjects.Sprite;
    private currentKey: SpriteKey | null = null;
    private pointerPos = { x: 0, y: 0 };

    public init(editor: MapEditorModule): void {
        this.editor = editor;
        editor.display.scene.input.on(PointerEvents.PointerMove, this.handlePointerMove, this);
    }

    public destroy(): void {
        this.editor.display.scene.input.off(PointerEvents.PointerMove, this.handlePointerMove, this);
        this.previewSprite?.destroy();
        this.previewSprite = undefined;
    }

    public update(): void {
        const key = getSelectedSpriteKey();
        const tool = getSelectedTool();

        if (!key || (tool !== 'paint' && tool !== 'drop')) {
            this.previewSprite?.setVisible(false);
            return;
        }

        if (this.currentKey !== key) {
            this.replacePreviewSprite(key);
        }

        if (this.previewSprite) {
            this.previewSprite.setVisible(true);
            this.previewSprite.setPosition(this.pointerPos.x, this.pointerPos.y);
        }
    }

    private handlePointerMove = (pointer: Phaser.Input.Pointer): void => {
        this.pointerPos = { x: pointer.worldX, y: pointer.worldY };
    };

    private replacePreviewSprite(key: SpriteKey): void {
        this.previewSprite?.destroy();

        const scene = this.editor.display.scene;
        const config = SpriteLibrary[key];
        const sprite = scene.add.sprite(this.pointerPos.x, this.pointerPos.y, key);
        sprite.setAlpha(0.5);
        sprite.setDepth(9999); // ensure it's on top
        sprite.setOrigin(0.5);

        const pxPerUnit = Config.Display.PixelsPerUnit;
        sprite?.setDisplaySize(config.defaultSize.x * pxPerUnit, config.defaultSize.y * pxPerUnit);
        
        this.previewSprite = sprite;
        this.currentKey = key;
    }
}
