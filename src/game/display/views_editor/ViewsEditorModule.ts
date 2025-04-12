import {DisplayModule} from "../setup/DisplayModule.ts";
import {GameDisplay} from "../GameDisplay.ts";
import {SpriteDefinition} from "../setup/ViewDefinition.ts";

export class ViewsEditorModule extends DisplayModule<GameDisplay> {
    private spriteDefinitions: SpriteDefinition[];
    
    override init(display: GameDisplay) {
        // populate spriteDefinitions
    }

    override update(delta: number) {
        
    }

    override destroy() {
        
    }
}