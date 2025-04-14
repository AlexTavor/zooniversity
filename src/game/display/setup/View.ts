import Phaser from "phaser";
import { ViewDefinition } from "./ViewDefinition.ts";
import {Naming} from "../../consts/Naming.ts";

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
        this.viewContainer.name = `${Naming.VIEW}${id}`;
        
        if (viewDefinition.spriteName) {
            this.addSprite(viewDefinition, scene, id);
        }
        
        this.viewContainer.setScale(viewDefinition.size.x, viewDefinition.size.y);

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

    public sortSubviewsByY(): void {
        const containers = this.viewContainer.list.filter(
            obj => obj instanceof Phaser.GameObjects.Container
        ) as Phaser.GameObjects.Container[];

        containers.sort((a, b) =>
            (a.y * a.scaleY) - (b.y * b.scaleY)
        );
        containers.forEach(c => this.viewContainer.bringToTop(c));
        
        this.subViews.forEach(subView => subView.sortSubviewsByY());
    }

    private addSprite(viewDefinition: ViewDefinition, scene: Phaser.Scene, id: number = this.id): void {
        this.sprite = scene.add.sprite(0, 0, viewDefinition.spriteName);
        this.sprite.name = `${Naming.SPRITE}${id}`;
        this.viewContainer.add(this.sprite);
        this.sprite.setInteractive({ useHandCursor: true });
        this.sprite.setOrigin(0.5, 0.5);
        this.sprite.setFrame(viewDefinition.frame);
    }
}
