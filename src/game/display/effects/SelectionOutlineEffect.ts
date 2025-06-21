import { View } from "../setup/View";
import { EffectInstance } from "../setup/ViewEffectController";

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
    private options: SelectionOutlineEffectOptions;
    private originalSprite: Phaser.GameObjects.Sprite | undefined;
    private duplicateSprite: Phaser.GameObjects.Sprite | undefined;
    outlinePlugin: any;

    constructor(view: View, options: SelectionOutlineEffectOptions) {
        this.view = view;
        this.options = options;
        this.originalSprite = this.view.getSprite();
    }

    public start(): void {
        if (!this.originalSprite) {
            return;
        }

        this.duplicateSprite = this.view.viewContainer.scene.add.sprite(
            this.originalSprite.x,
            this.originalSprite.y,
            this.originalSprite.texture.key,
            this.originalSprite.frame.name
        );
        
        this.duplicateSprite.setInteractive({ useHandCursor: false });
        this.duplicateSprite.setInteractive(false);
        this.options.container.add(this.duplicateSprite);
        this.duplicateSprite.setPipeline('outlineOnly');

        this.sync();
    }

    public stop(): void {
        this.destroy();
    }

    public update(): void {
        if (!this.originalSprite || !this.duplicateSprite) {
            this.destroy();
            return;
        }
        this.sync();
    }
    
    public destroy(): void {
        if (this.duplicateSprite) {
            this.duplicateSprite.resetPipeline();
            this.duplicateSprite.destroy();
            this.duplicateSprite = undefined;
        }
    }

    private sync(): void {
        if (!this.originalSprite || !this.duplicateSprite || !this.originalSprite.active) {
            this.duplicateSprite?.setVisible(false);
            return;
        }

        // Set visibility and frame
        this.duplicateSprite.setVisible(this.originalSprite.parentContainer.visible);
        this.duplicateSprite.setFrame(this.originalSprite.frame.name);

        this.duplicateSprite.x = this.view.viewContainer.x;
        this.duplicateSprite.y = this.view.viewContainer.y;
        
        // Sync all other visual properties for a perfect match.
        this.duplicateSprite.rotation = this.originalSprite.parentContainer.rotation;
        this.duplicateSprite.setOrigin(this.originalSprite.originX, this.originalSprite.originY);

        this.duplicateSprite.scaleX = this.originalSprite.scaleX * (this.originalSprite.parentContainer.scaleX > 0 ? 1 : -1);
        this.duplicateSprite.scaleY = this.originalSprite.scaleY;
        
        this.duplicateSprite.alpha = this.originalSprite.alpha;

        
    }
}