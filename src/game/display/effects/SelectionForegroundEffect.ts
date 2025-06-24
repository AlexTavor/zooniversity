import { View } from "../setup/View";
import { EffectInstance } from "../setup/ViewEffectController";
import { duplicateSprite, syncDuplicateSprite } from "../utils/spriteUtils";

export interface SelectionForegroundEffectOptions {
    container: Phaser.GameObjects.Container;
}

export class SelectionForegroundEffect implements EffectInstance {
    private view: View;
    private duplicateSprite: Phaser.GameObjects.Sprite | undefined;

    constructor(view: View, options: SelectionForegroundEffectOptions) {
        this.view = view;
        this.duplicateSprite = duplicateSprite(view, options.container);
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
        syncDuplicateSprite(this.view, this.duplicateSprite);
        this.duplicateSprite.alpha = 0.3;
    }

    public destroy(): void {
        if (this.duplicateSprite) {
            this.duplicateSprite.destroy();
            this.duplicateSprite = undefined;
        }
    }
}
