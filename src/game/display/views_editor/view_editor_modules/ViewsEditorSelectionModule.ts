import OutlinePipelinePlugin from 'phaser3-rex-plugins/plugins/outlinepipeline-plugin.js';
import {DisplayModule} from "../../setup/DisplayModule.ts";
import {ViewsEditorModule} from "../ViewsEditorModule.ts";
import {ViewDefinition} from "../../setup/ViewDefinition.ts";
import {PointerEvents} from "../../../consts/PointerEvents.ts";
import {Pos} from "../../../../utils/Math.ts";

export class ViewsEditorSelectionModule extends DisplayModule<ViewsEditorModule> {
    private editor!: ViewsEditorModule;
    private outlinePlugin!: OutlinePipelinePlugin;

    private selectedSprite?: Phaser.GameObjects.Sprite;
    private selectedViewId: number | null = null;

    private pointerStack: Phaser.GameObjects.Sprite[] = [];
    private currentStackIndex: number = 0;
    private pointerDownPos: Pos = { x: 0, y: 0 };

    public init(editor: ViewsEditorModule): void {
        this.editor = editor;
        const scene = editor.display.scene;

        this.outlinePlugin = scene.plugins.get('rexOutlinePipeline') as OutlinePipelinePlugin;

        scene.input.on(PointerEvents.PointerDown, this.handlePointerDown, this);
        scene.input.on(PointerEvents.PointerUp, this.handlePointerUp, this);
    }

    public update(): void {
        // nothing needed per frame yet
    }

    public destroy(): void {
        this.clearSelection();
        this.editor.display.scene.input.off('pointerup', this.handlePointerUp, this);
    }

    private handlePointerUp(pointer: Phaser.Input.Pointer): void {
        const dx = pointer.x - this.pointerDownPos.x;
        const dy = pointer.y - this.pointerDownPos.y;
        const distSq = dx * dx + dy * dy;
        const TAP_THRESHOLD_SQ = 9;

        if (distSq > TAP_THRESHOLD_SQ) return;

        const objects = this.editor.display.scene.input.hitTestPointer(pointer);

        this.pointerStack = objects
            .reverse()
            .filter(o => o instanceof Phaser.GameObjects.Sprite && this.isViewSprite(o)) as Phaser.GameObjects.Sprite[];

        if (this.pointerStack.length > 0) {
            const next = this.pointerStack[this.currentStackIndex % this.pointerStack.length];
            this.currentStackIndex++;
            this.selectSprite(next);
        }
    }
    
    private handlePointerDown(pointer: Phaser.Input.Pointer): void {
        this.pointerDownPos = { x: pointer.x, y: pointer.y };
    }
    
    private isViewSprite(obj: Phaser.GameObjects.GameObject): boolean {
        return obj instanceof Phaser.GameObjects.Sprite && obj.name?.startsWith('View_');
    }

    private spriteToViewId(sprite: Phaser.GameObjects.Sprite): number | null {
        const parts = sprite.name?.split('_');
        if (parts && parts[1]) {
            return parseInt(parts[1], 10);
        }
        return null;
    }

    private selectSprite(sprite: Phaser.GameObjects.Sprite): void {
        if (this.selectedSprite === sprite) return;

        this.clearSelection();

        const id = this.spriteToViewId(sprite);
        if (id == null) return;

        this.selectedSprite = sprite;
        this.selectedViewId = id;

        this.outlinePlugin.add(sprite, {
            thickness: 1,
            outlineColor: 0xff0000,
            quality: 0.1,
        });

        // TODO: optionally emit selection change for React to hook into
    }

    public clearSelection(): void {
        if (this.selectedSprite) {
            this.outlinePlugin.remove(this.selectedSprite);
        }
        this.selectedSprite = undefined;
        this.selectedViewId = null;
    }

    public getSelectedDefinition(): ViewDefinition | null {
        if (this.selectedViewId === null) return null;
        return this.editor.viewMap[this.selectedViewId] ?? null;
    }

    public getSelectedSprite(): Phaser.GameObjects.Sprite | undefined {
        return this.selectedSprite;
    }
}
