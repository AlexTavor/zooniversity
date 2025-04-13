import Phaser from "phaser";
import { ViewDefinition } from "./ViewDefinition.ts";

export class View {
    public readonly viewDefinition: ViewDefinition;
    public sprite: Phaser.GameObjects.Sprite;
    public viewContainer: Phaser.GameObjects.Container;
    public subViews: View[] = [];

    constructor(
        public id:number,
        views: { [key: number]: ViewDefinition },
        viewDefinition: ViewDefinition,
        parentContainer: Phaser.GameObjects.Container,
        scene: Phaser.Scene
    ) {
        this.viewDefinition = viewDefinition;

        this.viewContainer = scene.add.container(viewDefinition.position.x, viewDefinition.position.y);
        parentContainer.add(this.viewContainer);

        this.sprite = scene.add.sprite(0, 0, viewDefinition.name);
        this.sprite.name = `View_${id}`;
        this.viewContainer.add(this.sprite);
        this.sprite.setInteractive({ useHandCursor: true });

        this.sprite.setOrigin(0.5, 0.5);
        this.viewContainer.setScale(viewDefinition.size.x, viewDefinition.size.y);
        this.sprite.setFrame(viewDefinition.frame);

        const parentScaleX = parentContainer.scaleX || 1;
        const parentScaleY = parentContainer.scaleY || 1;

        const localScaleX = viewDefinition.size.x / parentScaleX;
        const localScaleY = viewDefinition.size.y / parentScaleY;

        this.viewContainer.setScale(localScaleX, localScaleY);
        
        for (const subViewId of viewDefinition.subViews) {
            const subViewDefinition = views[subViewId];
            if (subViewDefinition) {
                const subView = new View(subViewId, views, subViewDefinition, this.viewContainer, scene);
                this.subViews.push(subView);
            }
        }
    }

    public findViewSprite(viewId: number): Phaser.GameObjects.Sprite | null {
        if (this.viewDefinition.id === viewId) {
            return this.sprite;
        }

        for (const subView of this.subViews) {
            const result = subView.findViewSprite(viewId);
            if (result) return result;
        }

        return null;
    }
}
