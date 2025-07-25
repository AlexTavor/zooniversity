import { View } from "../setup/View";
import { EffectInstance } from "../setup/ViewEffectController";
import { duplicateSprite, syncDuplicateSprite } from "../utils/spriteUtils";

export interface SelectionOutlineEffectOptions {
    container: Phaser.GameObjects.Container;
    outlineConfig?: {
        thickness?: number;
        outlineColor?: number;
        quality?: number;
    };
}

export class SelectionOutlineEffect implements EffectInstance {
    private view: View;
    private duplicateSprite: Phaser.GameObjects.Sprite | undefined;

    constructor(view: View, options: SelectionOutlineEffectOptions) {
        this.view = view;
        this.duplicateSprite = duplicateSprite(view, options.container);
        this.duplicateSprite.setPipeline("outlineOnly");
    }

    public start(): void {
        if (!this.duplicateSprite) {
            return;
        }

        syncDuplicateSprite(this.view, this.duplicateSprite!);
    }

    public stop(): void {
        this.destroy();
    }

    public update(): void {
        if (!this.duplicateSprite) {
            return;
        }
        syncDuplicateSprite(this.view, this.duplicateSprite!);
    }

    public destroy(): void {
        if (this.duplicateSprite) {
            this.duplicateSprite.resetPipeline();
            this.duplicateSprite.destroy();
            this.duplicateSprite = undefined;
        }
    }
}
