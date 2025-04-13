
import { createView } from './ViewStore';
import {DisplayModule} from "../setup/DisplayModule.ts";
import {GameDisplay} from "../GameDisplay.ts";
import {View, ViewDefinition} from "../setup/ViewDefinition.ts";
import {Pos} from "../../../utils/Math.ts";
import {DropToAddViewModule} from "./view_editor_modules/DropToAddViewModule.ts";
import {SpriteLibrary} from "./SpriteLibrary.ts";
import {worldToLocal} from "../utils/worldToLocal.ts";

export class ViewsEditorModule extends DisplayModule<GameDisplay> {
    private display!: GameDisplay;
    private modules: DisplayModule<ViewsEditorModule>[] = [ new DropToAddViewModule()];

    private viewMap: Record<number, ViewDefinition> = {};
    private activeViewId: number | null = null;
    private activeViewInstance: View | null = null;

    private dirty: boolean = false;

    public init(display: GameDisplay): void {
        this.display = display;
        this.modules.forEach(m => m.init(this));
    }

    public update(delta: number): void {
        this.modules.forEach(m => m.update(delta));

        if (this.dirty) {
            this.refreshActiveView();
            this.dirty = false;
        }
    }

    public destroy(): void {
        this.modules.forEach(m => m.destroy());
        this.clearActiveView();
    }

    public addModule(module: DisplayModule<ViewsEditorModule>) {
        this.modules.push(module);
        if (this.display) {
            module.init(this); // for hot-injected modules
        }
    }

    public createViewFromDrop(spriteKey: string, position: Pos): void {
        const def = SpriteLibrary[spriteKey as keyof typeof SpriteLibrary];
        let adjustedPosition = position;

        if (this.activeViewInstance) {
            adjustedPosition = this.activeViewInstance
                ? worldToLocal(this.activeViewInstance.viewContainer, position)
                : position;
        }

        const view = createView({
            name: spriteKey,
            position: adjustedPosition,
            size: def?.defaultSize ?? { x: 1, y: 1 },
            frame: 0,
        });

        this.viewMap[view.id] = view;

        if (this.activeViewId === null) {
            this.setActiveView(view.id);
        } else {
            this.viewMap[this.activeViewId].subViews.push(view.id);
        }
    }


    private setActiveView(id: number) {
        this.activeViewId = id;
        this.markDirty();
    }

    private refreshActiveView() {
        this.clearActiveView();

        if (this.activeViewId === null) return;

        const def = this.viewMap[this.activeViewId];
        if (!def) return;

        this.activeViewInstance = new View(this.viewMap, def, this.display.layers.Plants, this.display.scene);
    }

    private clearActiveView() {
        if (this.activeViewInstance) {
            this.activeViewInstance.viewContainer.destroy();
            this.activeViewInstance = null;
        }
    }

    public markDirty() {
        this.dirty = true;
    }

    public getDisplay(): GameDisplay {
        return this.display;
    }
}
