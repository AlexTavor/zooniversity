import {Pos} from "../../../utils/Math.ts";

import Phaser from 'phaser';

export class ViewDefinition {
    public readonly id: number;
    public readonly name: string;
    public readonly position: Pos;
    public readonly size: Pos;
    public readonly frame: number;
    public readonly subViews: number[];
}

export class View {
    public readonly viewDefinition: ViewDefinition;
    public sprite: Phaser.GameObjects.Sprite;
    public viewContainer: Phaser.GameObjects.Container;
    
    constructor(
        views: { [key: number]: ViewDefinition },
        viewDefinition: ViewDefinition,
        parentContainer: Phaser.GameObjects.Container,
        scene: Phaser.Scene
    ) {
        this.viewDefinition = viewDefinition;

        this.viewContainer = scene.add.container(viewDefinition.position.x, viewDefinition.position.y);
        parentContainer.add(this.viewContainer);

        this.sprite = scene.add.sprite(0, 0, viewDefinition.name);
        this.viewContainer.add(this.sprite);

        this.sprite.setOrigin(0.5, 0.5); 
        this.viewContainer.setScale(viewDefinition.size.x, viewDefinition.size.y);
        this.sprite.setFrame(viewDefinition.frame);

        for (const subViewId of viewDefinition.subViews) {
            const subViewDefinition = views[subViewId];
            if (subViewDefinition) {
                new View(views, subViewDefinition, this.viewContainer, scene);
            }
        }
    }
}