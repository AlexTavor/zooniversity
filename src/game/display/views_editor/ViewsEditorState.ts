import {ViewMap, createView, getViews} from './ViewStore';
import { View } from '../setup/View';
import { ViewDefinition } from '../setup/ViewDefinition';
import { GameDisplay } from '../GameDisplay';
import { worldToLocal } from '../utils/worldToLocal';
import { SpriteLibrary } from './SpriteLibrary';
import { Pos } from '../../../utils/Math';
import {Snapshot} from "./view_editor_modules/edtor_history/EditorHistoryModule.ts";

export class ViewsEditorState {
    public viewMap: ViewMap = getViews();
    public activeViewId: number | null = null;
    public activeViewInstance: View | null = null;

    constructor(private display: GameDisplay) {}

    createRootView(): void {
        const root = createView({
            position: { x: 0, y: 0 },
            size: { x: 1, y: 1 },
            frame: 0,
        });
        this.viewMap[root.id] = root;
        this.activeViewId = root.id;
    }

    get activeDefinition(): ViewDefinition | null {
        return this.activeViewId != null ? this.viewMap[this.activeViewId] : null;
    }

    setActiveView(id: number): void {
        this.activeViewId = id;
    }

    clearActiveInstance(): void {
        if (this.activeViewInstance) {
            this.activeViewInstance.viewContainer.destroy();
            this.activeViewInstance = null;
        }
    }

    renderActiveView(): void {
        this.clearActiveInstance();

        const id = this.activeViewId;
        if (id == null) return;

        const def = this.viewMap[id];
        if (!def) return;

        this.activeViewInstance = new View(id, this.viewMap, def, this.display.layers.Ground, this.display.scene);
    }

    createViewFromDrop(spriteKey: string, position: Pos): void {
        const def = SpriteLibrary[spriteKey as keyof typeof SpriteLibrary];
        const container = this.activeViewInstance?.viewContainer;
        const localPos = container ? worldToLocal(container, position) : position;

        const view = createView({
            spriteName: spriteKey,
            position: localPos,
            size: def?.defaultSize ?? { x: 1, y: 1 },
            frame: 0,
        });

        this.viewMap[view.id] = view;

        if (this.activeViewId == null) {
            this.setActiveView(view.id);
        } else {
            this.viewMap[this.activeViewId].subViews.push(view.id);
        }
    }

    public applySnapshot(snapshot: Snapshot): void {
        this.clearActiveInstance();
        this.viewMap = snapshot.viewMap;
        this.activeViewId = snapshot.activeViewId;
    }

    public findViewInstance(viewId: number): View | null {
        if (!this.activeViewInstance) return null;
        return this.findInTree(this.activeViewInstance, viewId);
    }

    private findInTree(view: View, viewId: number): View | null {
        if (view.viewDefinition.id === viewId) return view;

        for (const sub of view.subViews) {
            const found = this.findInTree(sub, viewId);
            if (found) return found;
        }

        return null;
    }
}
