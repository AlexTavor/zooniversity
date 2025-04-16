import {DisplayModule} from "../../../../setup/DisplayModule.ts";
import {BaseMoveToolModule, MoveToolContext} from "../../../common/BaseMoveToolModule.ts";
import {Naming} from "../../../../../consts/Naming.ts";
import {MapEditorModule} from "../../MapEditorModule.ts";

export class MapEditorMoveToolModule extends DisplayModule<MapEditorModule> {
    private editor!: MapEditorModule;
    private moveTool = new BaseMoveToolModule();

    public init(editor: MapEditorModule): void {
        this.editor = editor;

        this.moveTool.init(
            new MoveToolContext(
                editor.display.scene,
                () => {
                    const sprite = this.editor.findSpriteUnderPointer(editor.display.scene.input.activePointer);
                    if (!sprite) return null;

                    const container = sprite.parentContainer;
                    if (!container?.name?.startsWith(Naming.VIEW)) return null;

                    const viewId = Number(container.name.replace(Naming.VIEW, ''));
                    if (isNaN(viewId)) return null;

                    return this.editor.getViewById(viewId)
                },
                (pos, view) => {
                    view.viewContainer.setPosition(pos.x, pos.y);
                    view.viewDefinition.position.x = pos.x;
                    view.viewDefinition.position.y = pos.y;

                    this.editor.state.markDirty();
                })
        );
    }

    public destroy(): void {
        this.moveTool.destroy();
    }

    public update(): void {
        // no-op
    }
}
