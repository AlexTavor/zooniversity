import {MapEditorModule} from "../../MapEditorModule.ts";
import {DisplayModule} from "../../../../setup/DisplayModule.ts";
import {View} from "../../../../setup/View.ts";
import {MapDefinition} from "../../MapTypes.ts";

export class MapViewRenderer extends DisplayModule<MapEditorModule> {
    private editor!: MapEditorModule;

    private hillContainer!: Phaser.GameObjects.Container;
    private treeLayer!: Phaser.GameObjects.Container;
    private renderedObjects: Record<number, View> = {};

    public init(editor: MapEditorModule): void {
        this.editor = editor;

        const scene = editor.display.scene;
        const ground = editor.display.layers.Ground;

        this.hillContainer = scene.add.container(0, 0);
        this.treeLayer = scene.add.container(0, 0);
        ground.add([this.hillContainer, this.treeLayer]);
    }

    public destroy(): void {
        this.clear();
        this.hillContainer?.destroy();
        this.treeLayer?.destroy();
    }

    public update(): void {
        if (this.editor.state.consumeDirty()) {
            const mapDef = this.editor.state.getMapDefinition();
            this.render(mapDef);
        }
    }

    public render(def: MapDefinition): void {
        this.clear();

        const scene = this.editor.display.scene;

        // Render hill
        new View(def.hill.id, {}, def.hill, this.hillContainer, scene);

        // Render trees
        for (const obj of Object.values(def.objects)) {
            if (obj.components?.view && obj.type === 'tree') {
                const view = new View(obj.id, {}, obj.components.view, this.treeLayer, scene);
                this.renderedObjects[obj.id] = view;
            }
        }
    }

    private clear(): void {
        this.hillContainer?.removeAll(true);
        this.treeLayer?.removeAll(true);
        this.renderedObjects = {};
    }
}
