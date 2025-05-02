import {MapEditorModule} from "../../MapEditorModule.ts";
import {DisplayModule} from "../../../../setup/DisplayModule.ts";
import {View} from "../../../../setup/View.ts";
import {MapDefinition} from "../../MapTypes.ts";
import Container = Phaser.GameObjects.Container;
import {Naming} from "../../../../../consts/Naming.ts";

export class MapViewRenderer extends DisplayModule<MapEditorModule> {
    private editor!: MapEditorModule;

    private treeLayer!: Phaser.GameObjects.Container;
    private caveLayer!: Phaser.GameObjects.Container;
    private renderedObjects: Record<number, View> = {};
    private readonly zById = new Map<string, number>();

    public init(editor: MapEditorModule): void {
        this.editor = editor;

        this.editor.getViewById = this.getViewById.bind(this);
        
        const scene = editor.display.scene;

        this.caveLayer = scene.add.container(0, 0);
        this.treeLayer = scene.add.container(0, 0);
        editor.display.layers.Caves.add(this.caveLayer);
        editor.display.layers.Surface.add(this.treeLayer);
    }

    public destroy(): void {
        this.clear();
        this.treeLayer?.destroy();
        this.caveLayer?.destroy();
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

        this.zById.clear();
        
        for (const obj of Object.values(def.objects)) {
            if (obj.components?.view) {
                const layer = obj.type === 'tree' ? this.treeLayer : this.caveLayer;
                this.renderedObjects[obj.id] = new View(obj.id, {}, obj.components.view, layer, scene);
                new View(obj.id, {}, obj.components.view, this.treeLayer, scene).sortSubviewsByY();
                this.zById.set(`${Naming.VIEW}${obj.id}`, obj.zHint ?? 0);
            }
        }

        const container = this.treeLayer as Phaser.GameObjects.Container;
        
        const sorted = container.list
            .filter(obj => obj instanceof Container)
            .sort((a, b) => {
                return (this.zById.get(a.name) ?? 0) - (this.zById.get(b.name) ?? 0);
            });

        sorted.forEach(c => container.bringToTop(c));
    }

    public getViewById(id: number): View | null {
        return this.renderedObjects[id] ?? null;
    }
    
    private clear(): void {
        this.treeLayer?.removeAll(true);
        this.caveLayer?.removeAll(true);
        this.renderedObjects = {};
        this.zById.clear();
    }
}